import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home/Home.jsx'
import Workspace from './pages/Workspace/Workspace.jsx'
import AuthPage from './pages/Auth/AuthPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { useAuth } from './auth/AuthContext.jsx'

function PublicAuthRoute({ mode }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="app-loading">Завантаження DM-System…</div>
  if (isAuthenticated) return <Navigate to="/workspace" replace />
  return <AuthPage mode={mode} />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<PublicAuthRoute mode="login" />} />
      <Route path="/register" element={<PublicAuthRoute mode="register" />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/workspace" element={<Workspace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
