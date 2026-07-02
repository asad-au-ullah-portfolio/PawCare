// Adjust this import if your axios instance is a named export (e.g. import { api } from './api')
import { api } from './api'

// ─── Types ────────────────────────────────────────────────────────────────────

// Mirrors PawCare.Server.Enums.PetSpecies — numeric, no JsonStringEnumConverter
export const PetSpecies = {
    Dog: 1,
    Cat: 2,
    Bird: 3,
    Rabbit: 4,
    Other: 5,
} as const

export type PetSpeciesValue = (typeof PetSpecies)[keyof typeof PetSpecies]

export const SPECIES_OPTIONS: { value: PetSpeciesValue; label: string; emoji: string }[] = [
    { value: 1, label: 'Dog', emoji: '🐶' },
    { value: 2, label: 'Cat', emoji: '🐱' },
    { value: 3, label: 'Bird', emoji: '🐦' },
    { value: 4, label: 'Rabbit', emoji: '🐰' },
    { value: 5, label: 'Other', emoji: '🐾' },
]

export function getSpeciesOption(value: number) {
    return SPECIES_OPTIONS.find((o) => o.value === value) ?? SPECIES_OPTIONS[4]
}

// Mirrors PetResponse record from the backend
export interface PetResponse {
    id: number
    name: string
    species: PetSpeciesValue
    breed: string
    dateOfBirth: string       // ISO 8601 string (UTC)
    isBirthDateEstimated: boolean
    weight: number | null
    ageInYears: number
}

// Mirrors CreatePetRequest / UpdatePetRequest (identical shape)
export interface PetPayload {
    name: string
    species: PetSpeciesValue
    breed: string
    dateOfBirth?: string | null
    ageInYears?: number | null
    weight?: number | null
}

// ─── API calls ────────────────────────────────────────────────────────────────

export const petsApi = {
    getAll: () => api.get<PetResponse[]>('/api/pets'),
    getOne: (id: number) => api.get<PetResponse>(`/api/pets/${id}`),
    create: (data: PetPayload) => api.post<PetResponse>('/api/pets', data),
    update: (id: number, data: PetPayload) => api.put(`/api/pets/${id}`, data),
    remove: (id: number) => api.delete(`/api/pets/${id}`),
}