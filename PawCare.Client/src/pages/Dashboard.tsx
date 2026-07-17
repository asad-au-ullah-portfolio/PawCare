import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { petsApi } from '../../services/pets'
import { appointmentsApi, AppointmentStatus, type AppointmentResponse } from '../../services/appointments'
import { veterinariansApi } from '../../services/veterinarians'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    PlusCircle,
    Calendar,
    PawPrint,
    Stethoscope,
    Clock,
    ArrowRight,
    HeartPulse,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Appointment {
    id: number
    petName: string
    vetName: string
    dateLabel: string
    time: string
    status: 'upcoming' | 'completed'
}

// ─── Formatting helpers ────────────────────────────────────────────────────────

function formatAppointment(appt: AppointmentResponse): Appointment {
    const date = new Date(appt.scheduledAt)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    let dateLabel = date.toLocaleDateString()
    if (date.toDateString() === today.toDateString()) {
        dateLabel = 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
        dateLabel = 'Tomorrow'
    }

    const time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    const isUpcoming = appt.status === AppointmentStatus.Scheduled ||
        appt.status === AppointmentStatus.Confirmed ||
        appt.status === AppointmentStatus.InProgress

    return {
        id: appt.id,
        petName: appt.petName,
        vetName: `Dr. ${appt.veterinarianFirstName} ${appt.veterinarianLastName}`,
        dateLabel,
        time,
        status: isUpcoming ? 'upcoming' : 'completed',
    }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
    emoji,
    label,
    value,
}: {
    emoji: string
    label: string
    value: number
}) {
    return (
        <Card className="flex-1">
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">{label}</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
                    </div>
                    <span className="text-3xl">{emoji}</span>
                </div>
            </CardContent>
        </Card>
    )
}

function AppointmentRow({ appt }: { appt: Appointment }) {
    const initials = appt.petName.charAt(0).toUpperCase()

    return (
        <div className="flex items-center gap-4 py-3">
            <Avatar className="h-10 w-10 shrink-0">
                <AvatarFallback className="bg-amber-100 text-amber-700 font-semibold text-sm">
                    {initials}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{appt.petName}</p>
                <p className="text-xs text-muted-foreground truncate">{appt.vetName}</p>
            </div>

            <div className="text-right shrink-0">
                <Badge variant="secondary" className="text-xs mb-1">
                    {appt.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                </Badge>
                <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" />
                    {appt.dateLabel} · {appt.time}
                </p>
            </div>
        </div>
    )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyWelcome({ onAddPet }: { onAddPet: () => void }) {
    return (
        <Card className="border-dashed">
            <CardContent className="pt-10 pb-10 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
                    <HeartPulse className="w-7 h-7 text-amber-500" />
                </div>
                <div>
                    <p className="font-semibold text-slate-900 text-base mb-1">Welcome to PawCare!</p>
                    <p className="text-sm text-muted-foreground">
                        You haven't added any pets yet. Start by creating a profile for your first pet.
                    </p>
                </div>
                <Button onClick={onAddPet} className="mt-2">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Your First Pet
                </Button>
            </CardContent>
        </Card>
    )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()

    // Derive a friendly display name from the user's name
    
    const displayName = user?.givenName?.trim() || 'there'

    const { data: petsData } = useQuery({
        queryKey: ['pets', user?.id],
        queryFn: async () => {
            const res = await petsApi.getAll()
            return res.data
        },
        enabled: !!user?.id,
    })

    const { data: vetsData } = useQuery({
        queryKey: ['veterinarians'],
        queryFn: async () => await veterinariansApi.getAll()
    })

    const { data: apptsData } = useQuery({
        queryKey: ['appointments', user?.id],
        queryFn: async () => {
            const res = await appointmentsApi.getAll()
            return res.data
        },
        enabled: !!user?.id,
    })

    const stats = {
        pets: petsData?.length || 0,
        upcoming: apptsData?.filter(a => a.status === AppointmentStatus.Scheduled || a.status === AppointmentStatus.Confirmed).length || 0,
        veterinarians: vetsData?.length || 0,
    }

    const appointments = (apptsData || [])
        .filter(a => a.status === AppointmentStatus.Scheduled || a.status === AppointmentStatus.Confirmed)
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
        .slice(0, 3)
        .map(formatAppointment)

    const hasActivity = (petsData?.length || 0) > 0

    const quickActions = [
        { icon: <PlusCircle className="w-4 h-4" />, label: 'Add Pet', to: '/pets/new' },
        { icon: <Calendar className="w-4 h-4" />, label: 'Book Appointment', to: '/veterinarians' },
        { icon: <PawPrint className="w-4 h-4" />, label: 'View Pets', to: '/pets' },
        { icon: <Stethoscope className="w-4 h-4" />, label: 'Browse Veterinarians', to: '/veterinarians' },
    ]

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Welcome back, {displayName} 👋
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your pets and appointments from one place.
                    </p>
                </div>
                <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => navigate('/pets/new')}>
                        <PlusCircle className="w-4 h-4 mr-1.5" />
                        Add Pet
                    </Button>
                    <Button size="sm" onClick={() => navigate('/veterinarians')}>
                        <Calendar className="w-4 h-4 mr-1.5" />
                        Book Appointment
                    </Button>
                </div>
            </div>

            <Separator />

            {/* ── Stats ──────────────────────────────────────────────────────── */}
            <div>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                    Overview
                </h2>
                <div className="flex flex-col sm:flex-row gap-4">
                    <StatCard emoji="🐾" label="My Pets" value={stats.pets} />
                    <StatCard emoji="📅" label="Upcoming Appointments" value={stats.upcoming} />
                    <StatCard emoji="👨‍⚕️" label="Veterinarians" value={stats.veterinarians} />
                </div>
            </div>

            {/* ── Quick Actions ───────────────────────────────────────────────── */}
            <div>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {quickActions.map((action) => (
                        <button
                            key={action.label}
                            onClick={() => navigate(action.to)}
                            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-5 text-sm font-medium text-slate-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 transition-colors duration-150 cursor-pointer"
                        >
                            <span className="text-amber-500">{action.icon}</span>
                            {action.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Upcoming Appointments ───────────────────────────────────────── */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                        Upcoming Appointments
                    </h2>
                    {appointments.length > 0 && (
                        <button
                            onClick={() => navigate('/appointments')}
                            className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 transition-colors"
                        >
                            View All <ArrowRight className="w-3 h-3" />
                        </button>
                    )}
                </div>

                {!hasActivity ? (
                    <EmptyWelcome onAddPet={() => navigate('/pets/new')} />
                ) : appointments.length === 0 ? (
                    <Card>
                        <CardContent className="pt-8 pb-8 text-center">
                            <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-40" />
                            <p className="text-sm text-muted-foreground">No upcoming appointments.</p>
                            <Button
                                variant="link"
                                size="sm"
                                className="mt-1 text-amber-600"
                                onClick={() => navigate('/veterinarians')}
                            >
                                Book one now
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="pt-4 pb-2 divide-y divide-slate-100">
                            {appointments.map((appt) => (
                                <AppointmentRow key={appt.id} appt={appt} />
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>

        </div>
    )
}