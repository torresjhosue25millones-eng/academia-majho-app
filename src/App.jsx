import { Routes, Route, Navigate } from 'react-router-dom'
import { useAcademia } from './context/AcademiaContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ModulePage from './pages/ModulePage'
import CertificatePage from './pages/CertificatePage'
import CommunityPage from './pages/CommunityPage'

function ProtectedRoute({ children }) {
  const { user } = useAcademia()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/modulo/:id" element={<ProtectedRoute><ModulePage /></ProtectedRoute>} />
      <Route path="/certificado" element={<ProtectedRoute><CertificatePage /></ProtectedRoute>} />
      <Route path="/comunidad" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
