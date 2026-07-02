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

// ─── Pets ─────────────────────────────────────────────────────────────────────

export type Species = 'Dog' | 'Cat' | 'Bird' | 'Rabbit' | 'Other'

export interface Pet {
    id: number
    name: string
    species: Species
    breed: string
    dateOfBirth: string | null
    ageInYears: number | null
    notes: string | null
}

export interface CreatePetRequest {
    name: string
    species: Species
    breed: string
    dateOfBirth?: string
    ageInYears?: number
    notes?: string
}

export interface UpdatePetRequest extends CreatePetRequest { }

export const petsApi = {
    getAll: () => api.get<Pet[]>('/api/pets'),
    getById: (id: number) => api.get<Pet>(`/api/pets/${id}`),
    create: (data: CreatePetRequest) => api.post<Pet>('/api/pets', data),
    // PUT returns 204 NoContent — no response body
    update: (id: number, data: UpdatePetRequest) => api.put<void>(`/api/pets/${id}`, data),
    delete: (id: number) => api.delete<void>(`/api/pets/${id}`),
}

// ─── Veterinarians ────────────────────────────────────────────────────────────

export interface Veterinarian {
    id: number
    firstName: string
    lastName: string
    specialization: string
    bio: string
    yearsOfExperience: number
    consultationFee: number
}

export const vetsApi = {
    getAll: () => api.get<Veterinarian[]>('/api/veterinarians'),
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