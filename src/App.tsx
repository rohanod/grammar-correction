import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { DocsPage } from '@/pages/DocsPage'
import { PayloadInputPage } from '@/pages/PayloadInputPage'

function RootRouter() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const hasData = params.has('data')

  return hasData ? <DocsPage /> : <PayloadInputPage />
}

function DocsRedirect() {
  const location = useLocation()
  return <Navigate to={{ pathname: '/', search: location.search }} replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRouter />} />
      <Route path="/docs" element={<DocsRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
