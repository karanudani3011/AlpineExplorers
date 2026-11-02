import fs from 'node:fs'

const content = fs.readFileSync('src/App.jsx', 'utf8')
const normalized = content.replace(/\r\n/g, '\n')

const target = `            <Route path="/blog" element={
              <Suspense fallback={<PageLoader />}><Blog /></Suspense>
            } />`

const replacement = `            <Route path="/blog" element={
              <Suspense fallback={<PageLoader />}><Blog /></Suspense>
            } />
            <Route path="/blog/:slug" element={
              <Suspense fallback={<PageLoader />}><BlogDetail /></Suspense>
            } />`

if (normalized.includes(target)) {
  const updated = normalized.replace(target, replacement)
  fs.writeFileSync('src/App.jsx', updated, 'utf8')
  console.log('Successfully patched App.jsx with /blog/:slug')
} else {
  console.error('Target not found in App.jsx')
}

