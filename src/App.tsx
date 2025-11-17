import { Navigate, Route, Routes } from 'react-router-dom'

import { DocsPage } from '@/pages/DocsPage'
import { PayloadInputPage } from '@/pages/PayloadInputPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<PayloadInputPage />} />
      <Route path="/docs" element={<DocsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
