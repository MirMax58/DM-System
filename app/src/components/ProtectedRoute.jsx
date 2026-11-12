import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="app-loading">Завантаження DM-System…</div>
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
