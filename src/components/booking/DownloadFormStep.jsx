import { motion } from 'framer-motion'
import { Download, ArrowLeft, ArrowRight, FileText } from 'lucide-react'

const NAVY = 'var(--ae-navy)'
const PDF_URL = '/downloads/Alpine_Explorers_Original_Application_Form.pdf'

export default function DownloadFormStep({ onBack, onNext }) {
  return <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl space-y-6">
    <div className="rounded-2xl border bg-white p-7 text-center shadow-sm" style={{ borderColor: 'rgba(180,160,130,.3)' }}>
      <FileText size={36} className="mx-auto mb-3 text-red-700" />
      <h2 className="text-xl font-bold" style={{ color: NAVY }}>Download Original Application Form (PDF)</h2>
      <p className="mt-2 text-sm text-gray-600">Print the original Alpine Explorers form, complete and sign it by hand, then upload one PDF for each traveler.</p>
      <a href={PDF_URL} download className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-800 px-5 py-3 text-sm font-bold text-white"><Download size={16}/> Download Original Application Form (PDF)</a>
      <p className="mt-2 text-xs text-gray-500">A4 printable form · one completed form per traveler</p>
    </div>
    <div className="flex justify-between"><button onClick={onBack} className="inline-flex items-center gap-2 rounded-xl border bg-white px-5 py-2.5 text-sm font-semibold"><ArrowLeft size={15}/> Back</button><button onClick={onNext} className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white" style={{background:`linear-gradient(135deg,${NAVY},var(--ae-navy-mid))`}}>Continue to PDF Upload <ArrowRight size={15}/></button></div>
  </motion.div>
}
