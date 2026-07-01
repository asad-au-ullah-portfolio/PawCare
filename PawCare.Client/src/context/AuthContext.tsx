import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { authApi, getToken, setToken, removeToken, type LoginRequest, type RegisterRequest } from '../../services/api'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthUser {
    email: string
    role: string
}

interface AuthContextValue {
    user: AuthUser | null
    isAuthenticated: boolean
    login: (data: LoginRequest) => Promise<void>
    register: (data: RegisterRequest) => Promise<void>
    logout: () => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

// ─── Helpers ──────────────────────────────────────────────────────────────────

// JWT claims written by JwtService:
//   sub   → user.Id
//   email → user.Email       (JwtRegisteredClaimNames.Email → "email" in payload)
//   role  → role string      (ClaimTypes.Role → "role" in payload via .NET mapping)
function decodeUser(token: string): AuthUser | null {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return {
            email: payload.email ?? '',
            role: payload.role ?? '',
        }
    } catch {
        return null
    }
}

function loadUserFromStorage(): AuthUser | null {
    const token = getToken()
    if (!token) return null
    return decodeUser(token)
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(loadUserFromStorage)

    const login = useCallback(async (data: LoginRequest) => {
        const response = await authApi.login(data)
        const { token } = response.data
        setToken(token)
        setUser(decodeUser(token))
    }, [])

    const register = useCallback(async (data: RegisterRequest) => {
        const response = await authApi.register(data)
        const { token } = response.data
        setToken(token)
        setUser(decodeUser(token))
    }, [])

    const logout = useCallback(() => {
        removeToken()
        setUser(null)
    }, [])

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: user !== null, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}