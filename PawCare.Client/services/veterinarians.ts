import { api } from './api'

export type VeterinarianSpecialty =
    | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface VeterinarianResponse {
    id: number;
    firstName: string;
    lastName: string;
    licenseNumber: string;
    specialty: VeterinarianSpecialty;
}

export const SPECIALTY_LABELS: Record<VeterinarianSpecialty, string> = {
    1: 'General Practice',
    2: 'Internal Medicine',
    3: 'Dermatology',
    4: 'Cardiology',
    5: 'Dentistry',
    6: 'Surgery',
    7: 'Oncology',
    8: 'Exotic Animals',
};

// getAll: () => api.get<Veterinarian[]>('/api/veterinarians'),
export const veterinariansApi = {
    getAll: async (): Promise<VeterinarianResponse[]> => {
        const response = await api.get<VeterinarianResponse[]>('/api/veterinarians');
        return response.data;
    },
    getById: async (id: number): Promise<VeterinarianResponse> => {
        const response = await api.get<VeterinarianResponse>(`/api/veterinarians/${id}`);
        return response.data;
    },
};