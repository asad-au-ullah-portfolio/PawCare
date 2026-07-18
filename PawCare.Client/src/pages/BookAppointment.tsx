import { useState, useMemo } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    ArrowLeft,
    Loader2,
    Stethoscope,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Check,
    CalendarDays,
} from 'lucide-react'

import {
    appointmentsApi,
    type AppointmentReasonValue,
    type CreateAppointmentPayload,
} from '../../services/appointments'
import { petsApi, getSpeciesOption, type PetResponse } from '../../services/pets'
import { veterinariansApi, SPECIALTY_LABELS, type VeterinarianResponse } from '../../services/veterinarians'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

// ─── Constants ────────────────────────────────────────────────────────────────

const REASON_CARDS: {
    value: AppointmentReasonValue
    label: string
    emoji: string
    duration: number
    desc: string
}[] = [
    { value: 1, label: 'Checkup',      emoji: '🐾', duration: 30, desc: 'General wellness exam'  },
    { value: 2, label: 'Vaccination',  emoji: '💉', duration: 15, desc: 'Routine immunizations'  },
    { value: 3, label: 'Surgery',      emoji: '✂️', duration: 60, desc: 'Surgical consultation'  },
    { value: 4, label: 'Grooming',     emoji: '✨', duration: 45, desc: 'Coat & hygiene care'    },
    { value: 5, label: 'Dental',       emoji: '🦷', duration: 30, desc: 'Teeth & oral health'    },
    { value: 6, label: 'Emergency',    emoji: '🚑', duration: 30, desc: 'Urgent care needed'     },
    { value: 7, label: 'Consultation', emoji: '🩺', duration: 30, desc: 'Expert advice session'  },
]

const TIME_SLOTS: string[] = (() => {
    const slots: string[] = []
    for (let h = 9; h <= 17; h++) {
        slots.push(`${String(h).padStart(2, '0')}:00`)
        if (h < 17) slots.push(`${String(h).padStart(2, '0')}:30`)
    }
    slots.push('17:30')
    return slots
})()

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
]

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const STEP_LABELS = ['Pet', 'Date & Time', 'Reason', 'Confirm'] as const

// ─── Wizard State ─────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4

interface WizardState {
    step: Step
    petId: number | null
    date: string          // YYYY-MM-DD
    time: string          // HH:MM
    reason: AppointmentReasonValue | null
    durationMinutes: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay()
}

function formatDate(dateStr: string): string {
    if (!dateStr) return ''
    const d = new Date(`${dateStr}T00:00:00`)
    return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

function formatTime(timeStr: string): string {
    if (!timeStr) return ''
    const [h, m] = timeStr.split(':').map(Number)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const hour = h % 12 || 12
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`
}

// ─── StepIndicator ────────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: Step }) {
    return (
        <div className="flex items-start justify-center mb-8">
            {STEP_LABELS.map((label, i) => {
                const num = (i + 1) as Step
                const completed = step > num
                const active = step === num
                return (
                    <div key={label} className="flex items-center">
                        <div className="flex flex-col items-center gap-1.5">
                            <div
                                className={cn(
                                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
                                    completed && 'bg-blue-600 text-white',
                                    active   && 'bg-blue-600 text-white ring-4 ring-blue-100',
                                    !active && !completed && 'bg-slate-100 text-slate-400',
                                )}
                            >
                                {completed ? <Check className="w-4 h-4" /> : num}
                            </div>
                            <span
                                className={cn(
                                    'text-xs font-medium whitespace-nowrap hidden sm:block transition-colors',
                                    active    ? 'text-blue-600' : 'text-slate-400',
                                    completed ? 'text-blue-400' : '',
                                )}
                            >
                                {label}
                            </span>
                        </div>
                        {i < STEP_LABELS.length - 1 && (
                            <div
                                className={cn(
                                    'h-0.5 w-10 sm:w-16 mx-2 mb-5 transition-colors duration-300',
                                    step > num ? 'bg-blue-500' : 'bg-slate-200',
                                )}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

// ─── VetSummaryBar ────────────────────────────────────────────────────────────

function VetSummaryBar({ vet }: { vet: VeterinarianResponse }) {
    return (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
                <p className="font-semibold text-slate-900 text-sm leading-none">
                    Dr. {vet.firstName} {vet.lastName}
                </p>
                <p className="text-xs text-blue-600 mt-1">{SPECIALTY_LABELS[vet.specialty]}</p>
            </div>
        </div>
    )
}

// ─── Step 1: Pet Selection ────────────────────────────────────────────────────

function StepPet({
    pets,
    selectedPetId,
    onSelect,
    onNext,
}: {
    pets: PetResponse[]
    selectedPetId: number | null
    onSelect: (id: number) => void
    onNext: () => void
}) {
    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
                <h2 className="text-xl font-bold text-slate-900">Select a pet</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Who's coming in today?</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {pets.map((pet) => {
                    const species = getSpeciesOption(pet.species)
                    const selected = selectedPetId === pet.id
                    return (
                        <button
                            key={pet.id}
                            onClick={() => onSelect(pet.id)}
                            className={cn(
                                'relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-center transition-all duration-200',
                                'hover:border-blue-400 hover:shadow-sm cursor-pointer',
                                selected
                                    ? 'border-blue-600 bg-blue-50 shadow-md'
                                    : 'border-slate-200 bg-white',
                            )}
                        >
                            {selected && (
                                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                </span>
                            )}
                            <span className="text-3xl">{species.emoji}</span>
                            <div>
                                <p className={cn(
                                    'font-semibold text-sm',
                                    selected ? 'text-blue-700' : 'text-slate-800',
                                )}>
                                    {pet.name}
                                </p>
                                <p className="text-xs text-muted-foreground">{species.label}</p>
                            </div>
                        </button>
                    )
                })}
            </div>

            <Button className="w-full" disabled={selectedPetId === null} onClick={onNext}>
                Continue
                <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
        </div>
    )
}

// ─── MiniCalendar ─────────────────────────────────────────────────────────────

function MiniCalendar({
    selectedDate,
    onSelect,
}: {
    selectedDate: string
    onSelect: (date: string) => void
}) {
    const today = useMemo(() => new Date(), [])
    const todayStr = useMemo(() => today.toISOString().split('T')[0], [today])

    const [viewYear, setViewYear] = useState(today.getFullYear())
    const [viewMonth, setViewMonth] = useState(today.getMonth())

    function prevMonth() {
        if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
        else setViewMonth(m => m - 1)
    }
    function nextMonth() {
        if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
        else setViewMonth(m => m + 1)
    }

    const canGoPrev =
        viewYear > today.getFullYear() ||
        (viewYear === today.getFullYear() && viewMonth > today.getMonth())

    const cells = useMemo(() => {
        const daysInMonth = getDaysInMonth(viewYear, viewMonth)
        const firstDay = getFirstDayOfMonth(viewYear, viewMonth)
        const result: { day: number | null; dateStr: string; disabled: boolean }[] = []

        for (let i = 0; i < firstDay; i++) {
            result.push({ day: null, dateStr: '', disabled: true })
        }
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
            result.push({ day: d, dateStr, disabled: dateStr < todayStr })
        }
        return result
    }, [viewYear, viewMonth, todayStr])

    return (
        <div className="select-none w-full">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={prevMonth}
                    disabled={!canGoPrev}
                    className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 text-slate-600" />
                </button>
                <span className="text-sm font-semibold text-slate-800">
                    {MONTH_NAMES[viewMonth]} {viewYear}
                </span>
                <button
                    onClick={nextMonth}
                    className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
                {DAY_NAMES.map(d => (
                    <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">
                        {d}
                    </div>
                ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-y-0.5">
                {cells.map((cell, i) => {
                    if (cell.day === null) return <div key={`e-${i}`} className="aspect-square" />
                    const isSelected = cell.dateStr === selectedDate
                    const isToday    = cell.dateStr === todayStr
                    return (
                        <button
                            key={cell.dateStr}
                            onClick={() => !cell.disabled && onSelect(cell.dateStr)}
                            disabled={cell.disabled}
                            className={cn(
                                'aspect-square flex items-center justify-center rounded-full text-sm transition-all duration-150 font-medium',
                                cell.disabled
                                    ? 'text-slate-300 cursor-not-allowed'
                                    : !isSelected
                                    ? 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                                    : '',
                                isToday && !isSelected && 'font-bold text-blue-600',
                                isSelected && 'bg-blue-600 text-white shadow-sm',
                            )}
                        >
                            {cell.day}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

// ─── Step 2: Date & Time ──────────────────────────────────────────────────────

function StepDateTime({
    selectedDate,
    selectedTime,
    onDateSelect,
    onTimeSelect,
    onNext,
    onBack,
}: {
    selectedDate: string
    selectedTime: string
    onDateSelect: (d: string) => void
    onTimeSelect: (t: string) => void
    onNext: () => void
    onBack: () => void
}) {
    const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])
    const nowMinutes = useMemo(() => {
        const n = new Date()
        return n.getHours() * 60 + n.getMinutes()
    }, [])

    function isSlotDisabled(slot: string): boolean {
        if (selectedDate !== todayStr) return false
        const [h, m] = slot.split(':').map(Number)
        return h * 60 + m <= nowMinutes
    }

    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
                <h2 className="text-xl font-bold text-slate-900">Choose a date & time</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Pick when you'd like to visit</p>
            </div>

            {/* Split panel */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1px_1fr] gap-4 sm:gap-0">
                {/* Calendar */}
                <Card className="rounded-xl border shadow-sm">
                    <CardContent className="p-4 sm:p-5">
                        <MiniCalendar selectedDate={selectedDate} onSelect={onDateSelect} />
                    </CardContent>
                </Card>

                {/* Desktop divider */}
                <div className="hidden sm:flex items-stretch">
                    <div className="w-px bg-border mx-5 my-4" />
                </div>

                {/* Time slots */}
                <Card className="rounded-xl border shadow-sm">
                    <CardContent className="p-4 sm:p-5">
                        {!selectedDate ? (
                            <div className="flex flex-col items-center justify-center h-full gap-3 py-8 text-center">
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                                    <CalendarDays className="w-6 h-6 text-slate-400" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Select a date to see<br />available times
                                </p>
                            </div>
                        ) : (
                            <>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                                    Available Times
                                </p>
                                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                                    {TIME_SLOTS.map((slot) => {
                                        const disabled = isSlotDisabled(slot)
                                        const selected  = slot === selectedTime
                                        return (
                                            <button
                                                key={slot}
                                                disabled={disabled}
                                                onClick={() => !disabled && onTimeSelect(slot)}
                                                className={cn(
                                                    'py-2 px-3 rounded-lg text-sm font-medium border transition-all duration-150',
                                                    disabled && 'opacity-30 cursor-not-allowed border-transparent text-slate-400',
                                                    !disabled && !selected && 'border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700',
                                                    selected && 'bg-blue-600 text-white border-blue-600 shadow-sm',
                                                )}
                                            >
                                                {formatTime(slot)}
                                            </button>
                                        )
                                    })}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="flex gap-3">
                <Button variant="outline" onClick={onBack} className="shrink-0">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                </Button>
                <Button
                    className="flex-1"
                    disabled={!selectedDate || !selectedTime}
                    onClick={onNext}
                >
                    Continue
                    <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        </div>
    )
}

// ─── Step 3: Reason ───────────────────────────────────────────────────────────

function StepReason({
    selectedReason,
    onSelect,
    onNext,
    onBack,
}: {
    selectedReason: AppointmentReasonValue | null
    onSelect: (value: AppointmentReasonValue, duration: number) => void
    onNext: () => void
    onBack: () => void
}) {
    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
                <h2 className="text-xl font-bold text-slate-900">What's the reason?</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Select the type of visit</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {REASON_CARDS.map((card) => {
                    const selected = selectedReason === card.value
                    return (
                        <button
                            key={card.value}
                            onClick={() => onSelect(card.value, card.duration)}
                            className={cn(
                                'relative flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all duration-200',
                                'hover:border-blue-400 hover:shadow-sm cursor-pointer',
                                selected
                                    ? 'border-blue-600 bg-blue-50 shadow-md'
                                    : 'border-slate-200 bg-white',
                            )}
                        >
                            {selected && (
                                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                </span>
                            )}
                            <span className="text-2xl leading-none">{card.emoji}</span>
                            <div className="flex-1">
                                <p className={cn(
                                    'font-semibold text-sm',
                                    selected ? 'text-blue-700' : 'text-slate-800',
                                )}>
                                    {card.label}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                                    {card.desc}
                                </p>
                            </div>
                            <span className={cn(
                                'text-xs px-2 py-0.5 rounded-full font-medium transition-colors',
                                selected
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-slate-100 text-slate-500',
                            )}>
                                {card.duration} min
                            </span>
                        </button>
                    )
                })}
            </div>

            <div className="flex gap-3">
                <Button variant="outline" onClick={onBack} className="shrink-0">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                </Button>
                <Button
                    className="flex-1"
                    disabled={selectedReason === null}
                    onClick={onNext}
                >
                    Continue
                    <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        </div>
    )
}

// ─── Step 4: Summary ──────────────────────────────────────────────────────────

function StepSummary({
    wizard,
    vet,
    pets,
    onBook,
    onBack,
    isBusy,
}: {
    wizard: WizardState
    vet: VeterinarianResponse
    pets: PetResponse[]
    onBook: () => void
    onBack: () => void
    isBusy: boolean
}) {
    const pet      = pets.find(p => p.id === wizard.petId)
    const reason   = REASON_CARDS.find(r => r.value === wizard.reason)
    const petSp    = pet ? getSpeciesOption(pet.species) : null

    const rows = [
        {
            emoji: '👤',
            label: 'Veterinarian',
            value: `Dr. ${vet.firstName} ${vet.lastName}`,
            sub: SPECIALTY_LABELS[vet.specialty],
        },
        {
            emoji: petSp?.emoji ?? '🐾',
            label: 'Patient',
            value: pet?.name ?? '—',
            sub: petSp?.label,
        },
        {
            emoji: '📅',
            label: 'Date',
            value: formatDate(wizard.date),
        },
        {
            emoji: '🕐',
            label: 'Time',
            value: formatTime(wizard.time),
        },
        {
            emoji: reason?.emoji ?? '🐾',
            label: 'Reason',
            value: reason?.label ?? '—',
            sub: reason?.desc,
        },
        {
            emoji: '⏱',
            label: 'Duration',
            value: `${wizard.durationMinutes} minutes`,
        },
    ]

    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
                <h2 className="text-xl font-bold text-slate-900">Confirm appointment</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Review your details before booking</p>
            </div>

            <Card className="rounded-xl overflow-hidden border shadow-sm">
                {/* Gradient header */}
                <div className="bg-linear-to-r from-blue-700 to-blue-500 px-5 py-4">
                    <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest">
                        Appointment Summary
                    </p>
                    <p className="text-white font-bold text-lg mt-1">
                        Dr. {vet.firstName} {vet.lastName}
                    </p>
                    <p className="text-blue-200 text-sm">{SPECIALTY_LABELS[vet.specialty]}</p>
                </div>

                {/* Rows */}
                <CardContent className="p-0">
                    {rows.map((row, i) => (
                        <div
                            key={i}
                            className={cn(
                                'flex items-center gap-4 px-5 py-3.5',
                                i < rows.length - 1 && 'border-b border-slate-100',
                            )}
                        >
                            <span className="text-xl w-7 shrink-0 text-center leading-none">
                                {row.emoji}
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                    {row.label}
                                </p>
                                <p className="text-sm font-semibold text-slate-900 truncate mt-0.5">
                                    {row.value}
                                </p>
                                {row.sub && (
                                    <p className="text-xs text-muted-foreground">{row.sub}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="flex gap-3">
                <Button variant="outline" onClick={onBack} disabled={isBusy} className="shrink-0">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                </Button>
                <Button className="flex-1" onClick={onBook} disabled={isBusy}>
                    {isBusy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Book Appointment
                </Button>
            </div>
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function BookAppointment() {
    const { vetId }     = useParams<{ vetId: string }>()
    const navigate      = useNavigate()
    const location      = useLocation()
    const queryClient   = useQueryClient()
    const { user }      = useAuth()

    const vetIdNum = vetId ? parseInt(vetId, 10) : undefined

    const [wizard, setWizard] = useState<WizardState>({
        step:            1,
        petId:           null,
        date:            '',
        time:            '',
        reason:          null,
        durationMinutes: 30,
    })

    function update(patch: Partial<WizardState>) {
        setWizard(w => ({ ...w, ...patch }))
    }

    // ── Queries ───────────────────────────────────────────────────────────────
    const { data: vet, isLoading: isVetLoading } = useQuery({
        queryKey: ['veterinarians', vetIdNum],
        queryFn:  () => veterinariansApi.getById(vetIdNum!),
        enabled:  !!vetIdNum,
    })

    const { data: pets, isLoading: isPetsLoading } = useQuery({
        queryKey: ['pets', user?.id],
        queryFn:  async () => {
            const res = await petsApi.getAll()
            return res.data
        },
        enabled: !!user?.id,
    })

    const hasPets = pets && pets.length > 0

    // ── Mutation ──────────────────────────────────────────────────────────────
    const bookMutation = useMutation({
        mutationFn: (payload: CreateAppointmentPayload) => appointmentsApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments', user?.id] })
            toast.success('Appointment booked successfully.')
            navigate('/appointments')
        },
        onError: (err: unknown) => {
            const axiosErr = err as { response?: { data?: { error?: string } } }
            const msg = axiosErr?.response?.data?.error ?? 'Failed to book appointment. Please try again.'
            toast.error(msg)
        },
    })

    function handleBook() {
        if (!wizard.petId || !wizard.date || !wizard.time || !wizard.reason) return
        const scheduledAt = new Date(`${wizard.date}T${wizard.time}`).toISOString()
        bookMutation.mutate({
            petId:           wizard.petId,
            veterinarianId:  vetIdNum!,
            scheduledAt,
            reason:          wizard.reason,
            durationMinutes: wizard.durationMinutes,
        })
    }

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">

            {/* Header */}
            <div>
                <button
                    onClick={() => navigate('/veterinarians')}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-slate-900 transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Veterinarians
                </button>
                <h1 className="text-2xl font-bold text-slate-900">Book an Appointment</h1>
            </div>

            {/* Vet bar */}
            {isVetLoading ? (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-1.5">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
            ) : vet ? (
                <VetSummaryBar vet={vet} />
            ) : null}

            {/* Main wizard area */}
            {isPetsLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
                    </div>
                </div>
            ) : !hasPets ? (
                <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-amber-800">No pets found</p>
                        <p className="text-xs text-amber-700 mt-0.5">
                            You need to add a pet before booking an appointment.{' '}
                            <button
                                onClick={() => navigate('/pets/new', { state: { returnTo: location.pathname } })}
                                className="underline underline-offset-2 hover:text-amber-900 transition-colors"
                            >
                                Add a pet
                            </button>
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    <StepIndicator step={wizard.step} />

                    {wizard.step === 1 && (
                        <StepPet
                            pets={pets}
                            selectedPetId={wizard.petId}
                            onSelect={(id) => update({ petId: id })}
                            onNext={() => update({ step: 2 })}
                        />
                    )}

                    {wizard.step === 2 && (
                        <StepDateTime
                            selectedDate={wizard.date}
                            selectedTime={wizard.time}
                            onDateSelect={(d) => update({ date: d, time: '' })}
                            onTimeSelect={(t) => update({ time: t })}
                            onNext={() => update({ step: 3 })}
                            onBack={() => update({ step: 1 })}
                        />
                    )}

                    {wizard.step === 3 && (
                        <StepReason
                            selectedReason={wizard.reason}
                            onSelect={(value, duration) => update({ reason: value, durationMinutes: duration })}
                            onNext={() => update({ step: 4 })}
                            onBack={() => update({ step: 2 })}
                        />
                    )}

                    {wizard.step === 4 && vet && (
                        <StepSummary
                            wizard={wizard}
                            vet={vet}
                            pets={pets}
                            onBook={handleBook}
                            onBack={() => update({ step: 3 })}
                            isBusy={bookMutation.isPending}
                        />
                    )}
                </>
            )}

        </div>
    )
}
