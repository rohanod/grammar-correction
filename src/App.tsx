import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { ViewerPage } from '@/pages/ViewerPage'
import { PayloadInputPage } from '@/pages/PayloadInputPage'

function RootRouter() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const hasData = params.has('data')

  return hasData ? <ViewerPage /> : <PayloadInputPage />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRouter />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
