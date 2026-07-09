import axios from 'axios'

const TOKEN_KEY = 'pawcare_token'

// ─── Token helpers ────────────────────────────────────────────────────────────

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY)
export const setToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token)
export const removeToken = (): void => localStorage.removeItem(TOKEN_KEY)

// ─── Axios instance ───────────────────────────────────────────────────────────

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: false,
    headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Don't redirect on 401 from auth endpoints — wrong credentials must surface
        // as a mutation error, not a page reload.
        const isAuthEndpoint = error.config?.url?.includes('/api/auth/')
        if (error.response?.status === 401 && !isAuthEndpoint) {
            removeToken()
            window.location.href = '/login'
        }
        return Promise.reject(error)
    },
)

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface RegisterRequest {
    firstName: string
    lastName: string
    email: string
    password: string
}

export interface LoginRequest {
    email: string
    password: string
}

// Matches exactly what the backend returns: { token, expiresAt, role }
export interface AuthResponse {
    token: string
    expiresAt: string
    role: string
}

export const authApi = {
    register: (data: RegisterRequest) =>
        api.post<AuthResponse>('/api/auth/register', data),
    login: (data: LoginRequest) =>
        api.post<AuthResponse>('/api/auth/login', data),
}

// Appointment types and API calls have moved to services/appointments.ts