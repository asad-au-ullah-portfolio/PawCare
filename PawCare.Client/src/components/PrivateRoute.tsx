import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function PrivateRoute() {
    const { isAuthenticated } = useAuth()
    return isAuthenticated ? (
        <main className="container mx-auto px-4 py-8 flex-1">
            <Outlet />
        </main>
    ) : (
        <Navigate to="/login" replace />
    )
}