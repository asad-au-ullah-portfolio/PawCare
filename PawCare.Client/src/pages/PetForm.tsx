import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ArrowLeft, Loader2 } from 'lucide-react'

import { petsApi, SPECIES_OPTIONS, type PetPayload } from '../../services/pets'
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

const petSchema = z
    .object({
        name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or fewer'),
        species: z.coerce.number().int().min(1).max(5, 'Please select a species'),
        breed: z.string().min(1, 'Breed is required').max(100, 'Breed must be 100 characters or fewer'),
        ageMode: z.enum(['dob', 'age']),
        dateOfBirth: z.string().optional(),
        ageInYears: z.coerce.number().int().min(0, 'Age cannot be negative').optional().or(z.literal('')),
        weight: z.coerce.number().positive('Weight must be greater than 0').optional().or(z.literal('')),
    })
    .superRefine((data, ctx) => {
        if (data.ageMode === 'dob') {
            if (!data.dateOfBirth) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Date of birth is required', path: ['dateOfBirth'] })
            } else if (new Date(data.dateOfBirth) > new Date()) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Date of birth cannot be in the future', path: ['dateOfBirth'] })
            }
        } else {
            if (data.ageInYears === '' || data.ageInYears === undefined) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Age is required', path: ['ageInYears'] })
            }
        }
    })

// type PetFormValues = z.infer<typeof petSchema>
type PetFormInput = z.input<typeof petSchema>
type PetFormValues = z.output<typeof petSchema>

// ─── Helper: build API payload from form values ───────────────────────────────

function toPayload(values: PetFormValues): PetPayload {
    return {
        name: values.name,
        species: values.species as PetPayload['species'],
        breed: values.breed,
        dateOfBirth: values.ageMode === 'dob' && values.dateOfBirth
            ? new Date(values.dateOfBirth).toISOString()
            : null,
        ageInYears: values.ageMode === 'age' && values.ageInYears !== ''
            ? Number(values.ageInYears)
            : null,
        weight: values.weight !== '' && values.weight !== undefined
            ? Number(values.weight)
            : null,
    }
}

// ─── Reusable field wrapper ───────────────────────────────────────────────────

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

// ─── Skeleton loader (edit mode while fetching) ───────────────────────────────

function FormSkeleton() {
    return (
        <div className="space-y-5">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-1.5">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-9 w-full" />
                </div>
            ))}
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PetForm() {
    const { id } = useParams<{ id?: string }>()
    const isEdit = !!id
    const petId = id ? parseInt(id, 10) : undefined

    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { user } = useAuth()

    // ── Fetch existing pet (edit mode only) ────────────────────────────────────
    const { data: existingPet, isLoading: isFetching } = useQuery({
        queryKey: ['pets', user?.id, petId],
        queryFn: async () => {
            const res = await petsApi.getOne(petId!)
            return res.data
        },
        enabled: isEdit && !!petId && !!user?.id,
    })

    // ── Form ───────────────────────────────────────────────────────────────────
    const {
        register,
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<PetFormInput, any, PetFormValues>({
        resolver: zodResolver(petSchema),
        defaultValues: {
            name: '',
            species: undefined,
            breed: '',
            ageMode: 'age',
            dateOfBirth: '',
            ageInYears: '',
            weight: '',
        },
    })

    // ── Populate form when existing pet loads (edit mode) ─────────────────────
    useEffect(() => {
        if (!existingPet) return
        reset({
            name: existingPet.name,
            species: existingPet.species,
            breed: existingPet.breed,
            ageMode: existingPet.isBirthDateEstimated ? 'age' : 'dob',
            dateOfBirth: existingPet.isBirthDateEstimated
                ? ''
                : existingPet.dateOfBirth.substring(0, 10), // "YYYY-MM-DD"
            ageInYears: existingPet.isBirthDateEstimated ? existingPet.ageInYears : '',
            weight: existingPet.weight ?? '',
        })
    }, [existingPet, reset])

    const ageMode = watch('ageMode')

    // ── Mutations ─────────────────────────────────────────────────────────────
    const createMutation = useMutation({
        mutationFn: (payload: PetPayload) => petsApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pets', user?.id] })
            toast.success('Pet added successfully.')
            navigate('/pets')
        },
        onError: () => {
            toast.error('Failed to add pet. Please try again.')
        },
    })

    const updateMutation = useMutation({
        mutationFn: (payload: PetPayload) => petsApi.update(petId!, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pets', user?.id] })
            queryClient.invalidateQueries({ queryKey: ['pets', user?.id, petId] })
            toast.success('Pet updated successfully.')
            navigate('/pets')
        },
        onError: () => {
            toast.error('Failed to update pet. Please try again.')
        },
    })

    const isBusy = isSubmitting || createMutation.isPending || updateMutation.isPending

    // ── Submit ────────────────────────────────────────────────────────────────
    function onSubmit(values: PetFormValues) {
        const payload = toPayload(values)
        if (isEdit) {
            updateMutation.mutate(payload)
        } else {
            createMutation.mutate(payload)
        }
    }

    return (
        <div className="max-w-xl mx-auto px-4 py-10 space-y-6">

            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div>
                <button
                    onClick={() => navigate('/pets')}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-slate-900 transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to My Pets
                </button>
                <h1 className="text-2xl font-bold text-slate-900">
                    {isEdit ? 'Edit Pet' : 'Add a New Pet'}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    {isEdit
                        ? "Update your pet's information below."
                        : 'Fill in the details below to add a pet to your profile.'}
                </p>
            </div>

            <Separator />

            {/* ── Form card ──────────────────────────────────────────────────── */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Pet Information</CardTitle>
                </CardHeader>
                <CardContent>
                    {isEdit && isFetching ? (
                        <FormSkeleton />
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                            {/* Name */}
                            <FieldRow label="Name" required error={errors.name?.message}>
                                <Input
                                    {...register('name')}
                                    placeholder="e.g. Bella"
                                    disabled={isBusy}
                                />
                            </FieldRow>

                            {/* Species */}
                            <FieldRow label="Species" required error={errors.species?.message}>
                                <Controller
                                    name="species"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value?.toString() ?? ''}
                                            onValueChange={(val) => field.onChange(Number(val))}
                                            disabled={isBusy}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select species">
                                                    {(value) => {
                                                        const selected = SPECIES_OPTIONS.find(s => s.value.toString() === value);
                                                        return selected ? (
                                                            <span className="flex items-center gap-1.5">
                                                                {selected.emoji} {selected.label}
                                                            </span>
                                                        ) : (
                                                            <span className="text-muted-foreground">Select species</span>
                                                        );
                                                    }}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SPECIES_OPTIONS.map((s) => (
                                                    <SelectItem key={s.value} value={s.value.toString()}>
                                                        {s.emoji} {s.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </FieldRow>

                            {/* Breed */}
                            <FieldRow label="Breed" required error={errors.breed?.message}>
                                <Input
                                    {...register('breed')}
                                    placeholder="e.g. Golden Retriever"
                                    disabled={isBusy}
                                />
                            </FieldRow>

                            {/* Age mode toggle */}
                            <FieldRow label="Age">
                                <Controller
                                    name="ageMode"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex rounded-md border border-input overflow-hidden text-sm">
                                            {(['age', 'dob'] as const).map((mode) => (
                                                <button
                                                    key={mode}
                                                    type="button"
                                                    disabled={isBusy}
                                                    onClick={() => field.onChange(mode)}
                                                    className={`flex-1 px-4 py-2 transition-colors ${field.value === mode
                                                        ? 'bg-slate-900 text-white font-medium'
                                                        : 'bg-white text-muted-foreground hover:bg-slate-50'
                                                        }`}
                                                >
                                                    {mode === 'age' ? 'Age in years' : 'Date of birth'}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                />
                            </FieldRow>

                            {/* Conditional age field */}
                            {ageMode === 'dob' ? (
                                <FieldRow label="Date of Birth" required error={errors.dateOfBirth?.message}>
                                    <Input
                                        type="date"
                                        {...register('dateOfBirth')}
                                        max={new Date().toISOString().split('T')[0]}
                                        disabled={isBusy}
                                    />
                                </FieldRow>
                            ) : (
                                <FieldRow label="Age (years)" required error={errors.ageInYears?.message}>
                                    <Input
                                        type="number"
                                        min={0}
                                        {...register('ageInYears')}
                                        placeholder="e.g. 3"
                                        disabled={isBusy}
                                    />
                                </FieldRow>
                            )}

                            {/* Weight (optional) */}
                            <FieldRow label="Weight (kg)" error={errors.weight?.message}>
                                <Input
                                    type="number"
                                    step="0.1"
                                    min={0.1}
                                    {...register('weight')}
                                    placeholder="Optional — e.g. 12.5"
                                    disabled={isBusy}
                                />
                            </FieldRow>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <Button type="submit" disabled={isBusy} className="flex-1">
                                    {isBusy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    {isEdit ? 'Save Changes' : 'Add Pet'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/pets')}
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