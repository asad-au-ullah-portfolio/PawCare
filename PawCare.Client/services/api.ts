import axios from 'axios'

const TOKEN_KEY = 'pawcare_token'

// ─── Token helpers ────────────────────────────────────────────────────────────

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY)
export const setToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token)
export const removeToken = (): void => localStorage.removeItem(TOKEN_KEY)

// ─── Axios instance ───────────────────────────────────────────────────────────

export const api = axios.create({
    baseURL: 'https://localhost:7228',
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

// ─── Appointments ─────────────────────────────────────────────────────────────

export type AppointmentStatus = 'Scheduled' | 'Completed' | 'Cancelled'
export type AppointmentType = 'InPerson' | 'Video'

export interface Appointment {
    id: number
    petId: number
    petName: string
    veterinarianId: number
    veterinarianName: string
    scheduledAt: string
    type: AppointmentType
    status: AppointmentStatus
    notes: string | null
    consultationFee: number
}

export interface BookAppointmentRequest {
    petId: number
    veterinarianId: number
    scheduledAt: string
    type: AppointmentType
    notes?: string
}

export const appointmentsApi = {
    // GET /api/appointments/me — not /api/appointments
    getAll: () => api.get<Appointment[]>('/api/appointments/me'),
    book: (data: BookAppointmentRequest) => api.post<Appointment>('/api/appointments', data),
}