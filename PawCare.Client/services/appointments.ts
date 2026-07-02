import { api } from './api'

// ─── Enums ────────────────────────────────────────────────────────────────────

// Mirrors PawCare.Server.Enums.AppointmentReason (integer enum, no JsonStringEnumConverter)
export const AppointmentReason = {
    Checkup: 1,
    Vaccination: 2,
    Surgery: 3,
    Grooming: 4,
    Dental: 5,
    Emergency: 6,
    Consultation: 7,
} as const

export type AppointmentReasonValue = (typeof AppointmentReason)[keyof typeof AppointmentReason]

export const REASON_OPTIONS: { value: AppointmentReasonValue; label: string }[] = [
    { value: 1, label: 'Checkup' },
    { value: 2, label: 'Vaccination' },
    { value: 3, label: 'Surgery' },
    { value: 4, label: 'Grooming' },
    { value: 5, label: 'Dental' },
    { value: 6, label: 'Emergency' },
    { value: 7, label: 'Consultation' },
]

// Mirrors PawCare.Server.Enums.AppointmentStatus (integer enum, no JsonStringEnumConverter)
export const AppointmentStatus = {
    Scheduled: 1,
    Confirmed: 2,
    InProgress: 3,
    Completed: 4,
    Cancelled: 5,
    NoShow: 6,
} as const

export type AppointmentStatusValue = (typeof AppointmentStatus)[keyof typeof AppointmentStatus]

export const STATUS_LABELS: Record<AppointmentStatusValue, string> = {
    1: 'Scheduled',
    2: 'Confirmed',
    3: 'In Progress',
    4: 'Completed',
    5: 'Cancelled',
    6: 'No Show',
}

// ─── Types ────────────────────────────────────────────────────────────────────

// Mirrors AppointmentResponse record from the backend
export interface AppointmentResponse {
    id: number
    scheduledAt: string             // ISO 8601 UTC string
    status: AppointmentStatusValue
    reason: AppointmentReasonValue
    notes: string
    durationMinutes: number
    petId: number
    petName: string
    veterinarianId: number
    veterinarianFirstName: string
    veterinarianLastName: string
}

// Mirrors CreateAppointmentRequest record from the backend
export interface CreateAppointmentPayload {
    petId: number
    veterinarianId: number
    scheduledAt: string             // ISO 8601 UTC string
    reason: AppointmentReasonValue
    durationMinutes: number
}

// ─── API calls ────────────────────────────────────────────────────────────────

export const appointmentsApi = {
    getAll: () => api.get<AppointmentResponse[]>('/api/appointments/me'),
    create: (data: CreateAppointmentPayload) => api.post<AppointmentResponse>('/api/appointments', data),
}
