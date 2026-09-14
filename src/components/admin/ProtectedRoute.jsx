import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Spinner } from '../../components/admin/admin-ui'
import AccessDenied from './AccessDenied'

export default function ProtectedRoute({
  children,
  roles,
  permission,
  superAdminOnly = false,
}) {
  const { user, loading, hasPermission, isSuperAdmin } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f5ecd8' }}>
        <Spinner />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  if (user.status === 'INACTIVE') {
    return <Navigate to="/admin/login" state={{ from: location, message: 'This account is deactivated. Contact the Super Admin.' }} replace />
  }

  // Super Admin only routes (e.g. Staff Management, Settings)
  if (superAdminOnly && !isSuperAdmin) {
    return <AccessDenied message="You don't have permission to access this section." />
  }

  // Explicit permission check
  if (permission && !hasPermission(permission)) {
    return <AccessDenied message="You don't have permission to access this section." />
  }

  // Legacy role check
  if (roles && !isSuperAdmin) {
    const userRole = (user.role || '').toUpperCase()
    const allowed = roles.some((r) => r.toUpperCase() === userRole || (r.toUpperCase() === 'SUPER_ADMIN' && isSuperAdmin))
    if (!allowed) {
      return <AccessDenied message="You don't have permission to access this section." />
    }
  }

  return children
}