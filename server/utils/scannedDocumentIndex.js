import { createCanvas, DOMMatrix, ImageData, Path2D } from '@napi-rs/canvas'
import { createWorker } from 'tesseract.js'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { db } from '../db.js'
import { supabaseAdmin } from './supabase.js'

const uploadsDir = path.resolve(process.cwd(), 'uploads')
let tesseractWorkerPromise

export async function extractPdfText(fileBuffer) {
  globalThis.DOMMatrix ||= DOMMatrix
  globalThis.ImageData ||= ImageData
  globalThis.Path2D ||= Path2D
  const pdf = await getDocument({ data: new Uint8Array(fileBuffer), useSystemFonts: true, disableFontFace: true }).promise
  try {
    const pages = []
    let hasText = false
    for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
      const page = await pdf.getPage(pageNo)
      const content = await page.getTextContent()
      const text = content.items.map(item => item.str || '').join(' ').replace(/\s+/g, ' ').trim()
      if (text) { pages.push(`[Page ${pageNo}] ${text}`); hasText = true; continue }
      const langPath = process.env.TESSERACT_LANG_PATH
      if (!langPath) throw new Error(`Page ${pageNo} is image-only. Set TESSERACT_LANG_PATH to a local Tesseract language-data directory to enable OCR.`)
      if (!tesseractWorkerPromise) {
        tesseractWorkerPromise = createWorker(process.env.TESSERACT_LANG || 'eng', 1, { langPath, cachePath: process.env.TESSERACT_CACHE_PATH || undefined })
          .catch(error => { tesseractWorkerPromise = null; throw error })
      }
      const worker = await tesseractWorkerPromise
      const viewport = page.getViewport({ scale: 1.8 })
      const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height))
      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise
      const { data } = await worker.recognize(await canvas.encode('png'))
      const ocrText = String(data.text || '').replace(/\s+/g, ' ').trim()
      if (ocrText) pages.push(`[Page ${pageNo}] ${ocrText}`)
    }
    const result = pages.join(' ').replace(/\s+/g, ' ').trim()
    if (!result) throw new Error('OCR completed but found no searchable text.')
    return result
  } finally {
    await pdf.cleanup()
  }
}

export async function indexScannedDocument({ bookingId, documentPath, documentName, fileBuffer = null }) {
  if (!String(documentName || documentPath || '').toLowerCase().endsWith('.pdf')) return { status: 'failed', error: 'Only PDF documents can be indexed.' }
  const safeName = String(documentPath || '').startsWith('/uploads/') ? path.basename(documentPath) : null
  const localPath = safeName ? path.resolve(uploadsDir, safeName) : null
  if (!fileBuffer && (!safeName || !localPath.startsWith(`${uploadsDir}${path.sep}`))) return { status: 'failed', error: 'Invalid document path.' }
  const indexPath = documentPath
  db.prepare(`INSERT INTO scanned_document_index(booking_id,document_path,document_name,index_status,index_error,extracted_text,indexed_at,updated_at)
    VALUES(?,?,?,'processing',NULL,'',NULL,datetime('now'))
    ON CONFLICT(document_path) DO UPDATE SET booking_id=excluded.booking_id,document_name=excluded.document_name,index_status='processing',index_error=NULL,updated_at=datetime('now')`)
    .run(bookingId, indexPath, documentName || safeName || indexPath)
  try {
    const buffer = fileBuffer || await fs.readFile(localPath)
    const extracted = await extractPdfText(buffer)
    db.prepare("UPDATE scanned_document_index SET extracted_text=?,index_status='indexed',index_error=NULL,indexed_at=datetime('now'),updated_at=datetime('now') WHERE document_path=?").run(extracted, indexPath)
    return { status: 'indexed' }
  } catch (error) {
    db.prepare("UPDATE scanned_document_index SET extracted_text='',index_status='failed',index_error=?,indexed_at=NULL,updated_at=datetime('now') WHERE document_path=?").run(error.message, indexPath)
    return { status: 'failed', error: error.message }
  }
}

export async function indexSupabaseBookingDocuments(bookingReference, expectedUserId = null) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('Private document indexing requires server Supabase configuration.')
  let bookingQuery = supabaseAdmin.from('bookings').select('id,booking_reference,user_id').eq('booking_reference', bookingReference)
  if (expectedUserId) bookingQuery = bookingQuery.eq('user_id', expectedUserId)
  const { data: booking, error: bookingError } = await bookingQuery.maybeSingle()
  if (bookingError) throw bookingError
  if (!booking) return { found: false, processed: 0, indexed: 0, failed: 0, results: [] }
  const localBooking = db.prepare('SELECT id FROM bookings WHERE booking_id=?').get(booking.booking_reference)
  if (!localBooking) throw new Error('The booking is not yet available in the admin booking index.')
  const { data: apps, error: appError } = await supabaseAdmin.from('traveler_applications').select('id,traveler_number').eq('booking_id', booking.id).order('traveler_number')
  if (appError) throw appError
  const results = []
  for (const app of apps || []) {
    const { data: docs, error: docsError } = await supabaseAdmin.from('application_documents').select('storage_path,original_filename,upload_status').eq('application_id', app.id)
    if (docsError) throw docsError
    for (const document of docs || []) {
      if (document.upload_status !== 'uploaded') continue
      const indexPath = `supabase://booking-private-docs/${document.storage_path}`
      try {
        const { data, error } = await supabaseAdmin.storage.from('booking-private-docs').download(document.storage_path)
        if (error || !data) throw error || new Error('Stored application PDF is unavailable.')
        results.push(await indexScannedDocument({ bookingId: localBooking.id, documentPath: indexPath, documentName: document.original_filename, fileBuffer: Buffer.from(await data.arrayBuffer()) }))
      } catch (error) { results.push({ status: 'failed', error: error.message }) }
    }
  }
  return { found: true, processed: results.length, indexed: results.filter(row => row.status === 'indexed').length, failed: results.filter(row => row.status === 'failed').length, results }
}

export async function reprocessScannedDocuments(bookingId = null) {
  const sourceBookings = bookingId == null
    ? db.prepare('SELECT id,scanned_forms FROM bookings').all()
    : db.prepare('SELECT id,scanned_forms FROM bookings WHERE id=?').all(bookingId)
  for (const booking of sourceBookings) {
    let forms = []
    try { forms = typeof booking.scanned_forms === 'string' ? JSON.parse(booking.scanned_forms || '[]') : (booking.scanned_forms || []) } catch {}
    for (const form of forms) {
      const fileName = path.basename(String(form.url || ''))
      if (fileName.toLowerCase().endsWith('.pdf')) {
        db.prepare("INSERT OR IGNORE INTO scanned_document_index(booking_id,document_path,document_name,index_status) VALUES(?,?,?,'pending')")
          .run(booking.id, `/uploads/${fileName}`, form.name || fileName)
      }
    }
  }
  const rows = bookingId == null
    ? db.prepare("SELECT booking_id,document_path,document_name FROM scanned_document_index WHERE document_path LIKE '/uploads/%' ORDER BY id").all()
    : db.prepare("SELECT booking_id,document_path,document_name FROM scanned_document_index WHERE booking_id=? AND document_path LIKE '/uploads/%' ORDER BY id").all(bookingId)
  const results = []
  for (const row of rows) results.push(await indexScannedDocument(row))
  const references = bookingId == null
    ? db.prepare('SELECT booking_id FROM bookings').all()
    : db.prepare('SELECT booking_id FROM bookings WHERE id=?').all(bookingId)
  for (const row of references) {
    try {
      const indexed = await indexSupabaseBookingDocuments(row.booking_id)
      if (indexed.found) results.push(...indexed.results)
    } catch (error) { results.push({ status: 'failed', error: error.message }) }
  }
  return results
}
