import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
    veterinariansApi,
    SPECIALTY_LABELS,
    type VeterinarianSpecialty,
} from '../../services/veterinarians';
import { useState } from 'react';

const SPECIALTY_OPTIONS: { value: VeterinarianSpecialty | ''; label: string }[] = [
    { value: '', label: 'All Specialties' },
    { value: 1, label: 'General Practice' },
    { value: 2, label: 'Internal Medicine' },
    { value: 3, label: 'Dermatology' },
    { value: 4, label: 'Cardiology' },
    { value: 5, label: 'Dentistry' },
    { value: 6, label: 'Surgery' },
    { value: 7, label: 'Oncology' },
    { value: 8, label: 'Exotic Animals' },
];

export default function Veterinarians() {
    const navigate = useNavigate();
    const [specialty, setSpecialty] = useState<VeterinarianSpecialty | ''>('');

    const { data: vets, isLoading, isError } = useQuery({
        queryKey: ['veterinarians', specialty],
        queryFn: () =>
            veterinariansApi.getAll(),
    });

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Our Veterinarians</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Browse our team and book a consultation
                    </p>
                </div>

                <select
                    value={specialty}
                    onChange={e =>
                        setSpecialty(
                            e.target.value === '' ? '' : (Number(e.target.value) as VeterinarianSpecialty)
                        )
                    }
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {SPECIALTY_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            {isLoading && (
                <div className="text-center py-20 text-gray-400">Loading veterinarians…</div>
            )}

            {isError && (
                <div className="text-center py-20 text-red-500">
                    Failed to load veterinarians. Please try again.
                </div>
            )}

            {vets && vets.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                    No veterinarians found for this specialty.
                </div>
            )}

            {vets && vets.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {vets.map(vet => (
                        <div
                            key={vet.id}
                            className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-semibold">
                                    {vet.firstName[0]}{vet.lastName[0]}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        Dr. {vet.firstName} {vet.lastName}
                                    </p>
                                    <p className="text-xs text-gray-400">#{vet.licenseNumber}</p>
                                </div>
                            </div>

                            <div>
                                <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                                    {SPECIALTY_LABELS[vet.specialty]}
                                </span>
                            </div>

                            <button
                                onClick={() =>
                                    navigate(`/book-appointment?vetId=${vet.id}`)
                                }
                                className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                            >
                                Book Appointment
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}