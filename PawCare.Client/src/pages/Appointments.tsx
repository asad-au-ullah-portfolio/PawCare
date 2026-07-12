import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { Calendar, Clock, PlusCircle, Stethoscope } from 'lucide-react'

import {
    appointmentsApi,
    STATUS_LABELS,
    REASON_OPTIONS,
    AppointmentStatus,
    type AppointmentResponse,
    type AppointmentStatusValue,
} from '../../services/appointments'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(isoStr: string) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(isoStr))
}

function formatTime(isoStr: string) {
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).format(new Date(isoStr))
}

function getReasonLabel(value: number) {
    return REASON_OPTIONS.find((r) => r.value === value)?.label ?? 'Unknown'
}

function StatusBadge({ status }: { status: AppointmentStatusValue }) {
    const label = STATUS_LABELS[status]

    const className = {
        1: 'bg-blue-50 text-blue-700 border-blue-200',      // Scheduled
        2: 'bg-emerald-50 text-emerald-700 border-emerald-200', // Confirmed
        3: 'bg-amber-50 text-amber-700 border-amber-200',   // InProgress
        4: 'bg-slate-100 text-slate-600 border-slate-200',  // Completed
        5: 'bg-red-50 text-red-600 border-red-200',         // Cancelled
        6: 'bg-orange-50 text-orange-700 border-orange-200', // NoShow
    }[status] ?? 'bg-slate-100 text-slate-600 border-slate-200'

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${className}`}>
            {label}
        </span>
    )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function AppointmentCardSkeleton() {
    return (
        <Card>
            <CardContent className="pt-5 pb-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-44" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                    <Skeleton className="h-5 w-20 rounded-full" />
                </div>
            </CardContent>
        </Card>
    )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onBook }: { onBook: () => void }) {
    return (
        <Card className="border-dashed">
            <CardContent className="pt-12 pb-12 flex flex-col items-center text-center gap-4">
                <span className="text-5xl">📅</span>
                <div>
                    <p className="font-semibold text-slate-900 text-base mb-1">No appointments yet.</p>
                    <p className="text-sm text-muted-foreground">
                        Book a visit with one of our veterinarians to get started.
                    </p>
                </div>
                <Button onClick={onBook}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Book an Appointment
                </Button>
            </CardContent>
        </Card>
    )
}

// ─── Appointment card ─────────────────────────────────────────────────────────

function AppointmentCard({ appt }: { appt: AppointmentResponse }) {
    return (
        <Card className="hover:shadow-sm transition-shadow duration-200">
            <CardContent className="pt-5 pb-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">

                    {/* Left: icon + info */}
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                            <Stethoscope className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-semibold text-slate-900 text-base">{appt.petName}</p>
                            <p className="text-sm text-muted-foreground">
                                Dr. {appt.veterinarianFirstName} {appt.veterinarianLastName}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-0.5 flex-wrap">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(appt.scheduledAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatTime(appt.scheduledAt)} · {appt.durationMinutes} min
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {getReasonLabel(appt.reason)}
                            </p>
                        </div>
                    </div>

                    {/* Right: status */}
                    <div className="shrink-0">
                        <StatusBadge status={appt.status} />
                    </div>

                </div>
            </CardContent>
        </Card>
    )
}

// ─── Section heading ──────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            {children}
        </h2>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const UPCOMING_STATUSES: AppointmentStatusValue[] = [
    AppointmentStatus.Scheduled,
    AppointmentStatus.Confirmed,
    AppointmentStatus.InProgress,
]

export function Appointments() {
    const navigate = useNavigate()
    const { user } = useAuth()

    const { data: appointments, isLoading, isError } = useQuery({
        queryKey: ['appointments', user?.id],
        queryFn: async () => {
            const res = await appointmentsApi.getAll()
            return res.data
        },
        enabled: !!user?.id,
    })

    const upcoming = appointments?.filter((a) => UPCOMING_STATUSES.includes(a.status)) ?? []
    const past = appointments?.filter((a) => !UPCOMING_STATUSES.includes(a.status)) ?? []

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">

            {/* ── Header ───────────────────────────────────────────────────────── */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Appointments</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        All your scheduled and past visits in one place.
                    </p>
                </div>
                <Button onClick={() => navigate('/veterinarians')} className="shrink-0">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Book Appointment
                </Button>
            </div>

            <Separator />

            {/* ── Loading ───────────────────────────────────────────────────────── */}
            {isLoading && (
                <div className="space-y-4">
                    <AppointmentCardSkeleton />
                    <AppointmentCardSkeleton />
                    <AppointmentCardSkeleton />
                </div>
            )}

            {/* ── Error ─────────────────────────────────────────────────────────── */}
            {isError && (
                <Card className="border-destructive/30 bg-destructive/5">
                    <CardContent className="pt-6 pb-6 text-center">
                        <p className="text-sm text-destructive font-medium">Failed to load appointments.</p>
                        <p className="text-xs text-muted-foreground mt-1">Check your connection and try again.</p>
                    </CardContent>
                </Card>
            )}

            {/* ── Empty ─────────────────────────────────────────────────────────── */}
            {!isLoading && !isError && appointments?.length === 0 && (
                <EmptyState onBook={() => navigate('/veterinarians')} />
            )}

            {/* ── Upcoming ──────────────────────────────────────────────────────── */}
            {!isLoading && !isError && upcoming.length > 0 && (
                <div>
                    <SectionHeading>Upcoming</SectionHeading>
                    <div className="space-y-4">
                        {upcoming.map((appt) => (
                            <AppointmentCard key={appt.id} appt={appt} />
                        ))}
                    </div>
                </div>
            )}

            {/* ── Past ──────────────────────────────────────────────────────────── */}
            {!isLoading && !isError && past.length > 0 && (
                <div>
                    <SectionHeading>Past</SectionHeading>
                    <div className="space-y-4">
                        {past.map((appt) => (
                            <AppointmentCard key={appt.id} appt={appt} />
                        ))}
                    </div>
                </div>
            )}

        </div>
    )
}