import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/pets', label: 'My Pets' },
    { to: '/veterinarians', label: 'Veterinarians' },
    { to: '/appointments', label: 'Appointments' },
]

export function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/dashboard" className="text-xl font-bold text-teal-600 tracking-tight">
                    PawCare
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`text-sm font-medium transition-colors ${location.pathname.startsWith(to)
                                    ? 'text-teal-600'
                                    : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            {label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 hidden md:block">{user?.email}</span>
                    <button
                        onClick={handleLogout}
                        className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        Sign out
                    </button>
                </div>
            </div>
        </nav>
    )
}