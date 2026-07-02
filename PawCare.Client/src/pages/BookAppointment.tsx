import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ArrowLeft, Loader2, Stethoscope, AlertCircle } from 'lucide-react'

import { appointmentsApi, REASON_OPTIONS, type CreateAppointmentPayload } from '../../services/appointments'
import { petsApi, getSpeciesOption } from '../../services/pets'
import { veterinariansApi, SPECIALTY_LABELS } from '../../services/veterinarians'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

// ─── Schema ───────────────────────────────────────────────────────────────────

const today = new Date().toISOString().split('T')[0]

const bookingSchema = z.object({
    petId: z.coerce.number().int().positive('Please select a pet'),
    date: z.string().min(1, 'Please pick a date'),
    time: z.string().min(1, 'Please pick a time'),
    reason: z.coerce.number().int().min(1).max(7, 'Please select a reason'),
    durationMinutes: z.coerce.number().int().min(15).max(240),
})

type BookingFormInput = z.input<typeof bookingSchema>
type BookingFormValues = z.output<typeof bookingSchema>

// ─── FieldRow ─────────────────────────────────────────────────────────────────

function FieldRow({
    label,
    required,
    error,
    children,
}: {
    label: string
    required?: boolean
    error?: string
    children: React.ReactNode
}) {
    return (
        <div className="space-y-1.5">
            <Label>
                {label}
                {required && <span className="text-destructive ml-0.5">*</span>}
            </Label>
            {children}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    )
}

// ─── Vet card skeleton ─────────────────────────────────────────────────────────

function VetCardSkeleton() {
    return (
        <Card>
            <CardContent className="pt-5 pb-5">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-28" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function BookAppointment() {
    const { vetId } = useParams<{ vetId: string }>()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const vetIdNum = vetId ? parseInt(vetId, 10) : undefined

    // ── Fetch vet ─────────────────────────────────────────────────────────────
    const { data: vet, isLoading: isVetLoading } = useQuery({
        queryKey: ['veterinarians', vetIdNum],
        queryFn: () => veterinariansApi.getById(vetIdNum!),
        enabled: !!vetIdNum,
    })

    // ── Fetch user's pets ──────────────────────────────────────────────────────
    const { data: pets, isLoading: isPetsLoading } = useQuery({
        queryKey: ['pets'],
        queryFn: async () => {
            const res = await petsApi.getAll()
            return res.data
        },
    })

    const hasPets = pets && pets.length > 0

    // ── Form ──────────────────────────────────────────────────────────────────
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<BookingFormInput, unknown, BookingFormValues>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            petId: undefined,
            date: '',
            time: '',
            reason: undefined,
            durationMinutes: 30,
        },
    })

    // ── Mutation ──────────────────────────────────────────────────────────────
    const bookMutation = useMutation({
        mutationFn: (payload: CreateAppointmentPayload) => appointmentsApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] })
            toast.success('Appointment booked successfully.')
            navigate('/appointments')
        },
        onError: (err: unknown) => {
            const axiosErr = err as { response?: { data?: { error?: string } } }
            const msg = axiosErr?.response?.data?.error ?? 'Failed to book appointment. Please try again.'
            toast.error(msg)
        },
    })

    const isBusy = isSubmitting || bookMutation.isPending

    // ── Submit ────────────────────────────────────────────────────────────────
    function onSubmit(values: BookingFormValues) {
        // Combine local date + time strings into a UTC ISO string for the backend
        const scheduledAt = new Date(`${values.date}T${values.time}`).toISOString()
        bookMutation.mutate({
            petId: values.petId,
            veterinarianId: vetIdNum!,
            scheduledAt,
            reason: values.reason,
            durationMinutes: values.durationMinutes,
        })
    }

    return (
        <div className="max-w-xl mx-auto px-4 py-10 space-y-6">

            {/* ── Header ────────────────────────────────────────────────────── */}
            <div>
                <button
                    onClick={() => navigate('/veterinarians')}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-slate-900 transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Veterinarians
                </button>
                <h1 className="text-2xl font-bold text-slate-900">Book an Appointment</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Fill in the details below to schedule a visit.
                </p>
            </div>

            <Separator />

            {/* ── Vet summary card ──────────────────────────────────────────── */}
            {isVetLoading ? (
                <VetCardSkeleton />
            ) : vet ? (
                <Card>
                    <CardContent className="pt-5 pb-5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                <Stethoscope className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900">
                                    Dr. {vet.firstName} {vet.lastName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {SPECIALTY_LABELS[vet.specialty]}
                                </p>
                                <p className="text-xs text-muted-foreground">#{vet.licenseNumber}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : null}

            {/* ── Booking form ──────────────────────────────────────────────── */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Appointment Details</CardTitle>
                </CardHeader>
                <CardContent>
                    {isPetsLoading ? (
                        <div className="space-y-5">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="space-y-1.5">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-9 w-full" />
                                </div>
                            ))}
                        </div>
                    ) : !hasPets ? (
                        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-amber-800">No pets found</p>
                                <p className="text-xs text-amber-700 mt-0.5">
                                    You need to add a pet before booking an appointment.{' '}
                                    <button
                                        onClick={() => navigate('/pets/new')}
                                        className="underline underline-offset-2 hover:text-amber-900 transition-colors"
                                    >
                                        Add a pet
                                    </button>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                            {/* Pet */}
                            <FieldRow label="Pet" required error={errors.petId?.message}>
                                <Controller
                                    name="petId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value?.toString() ?? ''}
                                            onValueChange={(val) => field.onChange(Number(val))}
                                            disabled={isBusy}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a pet" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {pets.map((pet) => {
                                                    const species = getSpeciesOption(pet.species)
                                                    return (
                                                        <SelectItem key={pet.id} value={pet.id.toString()}>
                                                            {species.emoji} {pet.name}
                                                        </SelectItem>
                                                    )
                                                })}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </FieldRow>

                            {/* Date */}
                            <FieldRow label="Date" required error={errors.date?.message}>
                                <Input
                                    type="date"
                                    min={today}
                                    {...register('date')}
                                    disabled={isBusy}
                                />
                            </FieldRow>

                            {/* Time */}
                            <FieldRow label="Time" required error={errors.time?.message}>
                                <Input
                                    type="time"
                                    {...register('time')}
                                    disabled={isBusy}
                                />
                            </FieldRow>

                            {/* Reason */}
                            <FieldRow label="Reason" required error={errors.reason?.message}>
                                <Controller
                                    name="reason"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value?.toString() ?? ''}
                                            onValueChange={(val) => field.onChange(Number(val))}
                                            disabled={isBusy}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a reason" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {REASON_OPTIONS.map((r) => (
                                                    <SelectItem key={r.value} value={r.value.toString()}>
                                                        {r.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </FieldRow>

                            {/* Duration */}
                            <FieldRow label="Duration" required error={errors.durationMinutes?.message}>
                                <Controller
                                    name="durationMinutes"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value?.toString() ?? '30'}
                                            onValueChange={(val) => field.onChange(Number(val))}
                                            disabled={isBusy}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[15, 30, 45, 60].map((d) => (
                                                    <SelectItem key={d} value={d.toString()}>
                                                        {d} minutes
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </FieldRow>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <Button type="submit" disabled={isBusy} className="flex-1">
                                    {isBusy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Book Appointment
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/veterinarians')}
                                    disabled={isBusy}
                                >
                                    Cancel
                                </Button>
                            </div>

                        </form>
                    )}
                </CardContent>
            </Card>

        </div>
    )
}
