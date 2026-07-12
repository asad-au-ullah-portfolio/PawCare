import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { PlusCircle, Pencil, Trash2, Weight, CalendarDays } from 'lucide-react'

import { petsApi, getSpeciesOption, type PetResponse } from '../../services/pets'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function PetCardSkeleton() {
    return (
        <Card>
            <CardContent className="pt-6 pb-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-3 w-40" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-16" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd: () => void }) {
    return (
        <Card className="border-dashed">
            <CardContent className="pt-12 pb-12 flex flex-col items-center text-center gap-4">
                <span className="text-5xl">🐾</span>
                <div>
                    <p className="font-semibold text-slate-900 text-base mb-1">No pets yet.</p>
                    <p className="text-sm text-muted-foreground">
                        Add your first pet to start booking appointments.
                    </p>
                </div>
                <Button onClick={onAdd}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Pet
                </Button>
            </CardContent>
        </Card>
    )
}

// ─── Pet card ─────────────────────────────────────────────────────────────────

function PetCard({
    pet,
    onEdit,
    onDelete,
}: {
    pet: PetResponse
    onEdit: () => void
    onDelete: () => void
}) {
    const species = getSpeciesOption(pet.species)

    return (
        <Card className="hover:shadow-sm transition-shadow duration-200">
            <CardContent className="pt-5 pb-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">

                    {/* Left: icon + info */}
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-2xl shrink-0">
                            {species.emoji}
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-slate-900 text-base">{pet.name}</h3>
                                <Badge variant="secondary" className="text-xs">{species.label}</Badge>
                                {pet.isBirthDateEstimated && (
                                    <Badge variant="outline" className="text-xs text-muted-foreground">
                                        Estimated age
                                    </Badge>
                                )}
                            </div>

                            <p className="text-sm text-muted-foreground">{pet.breed}</p>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1 flex-wrap">
                                <span className="flex items-center gap-1">
                                    <CalendarDays className="w-3 h-3" />
                                    {pet.ageInYears === 0 ? 'Under 1 year' : `${pet.ageInYears} yr${pet.ageInYears !== 1 ? 's' : ''}`}
                                </span>
                                {pet.weight != null && (
                                    <span className="flex items-center gap-1">
                                        <Weight className="w-3 h-3" />
                                        {pet.weight} kg
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: actions */}
                    <div className="flex gap-2 shrink-0">
                        <Button variant="outline" size="sm" onClick={onEdit}>
                            <Pencil className="w-3.5 h-3.5 mr-1.5" />
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={onDelete}
                        >
                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                            Delete
                        </Button>
                    </div>

                </div>
            </CardContent>
        </Card>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Pets() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)

    // Fetch
    const { data: pets, isLoading, isError } = useQuery({
        queryKey: ['pets', user?.id],
        queryFn: async () => {
            const res = await petsApi.getAll()
            return res.data
        },
        enabled: !!user?.id,
    })

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id: number) => petsApi.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pets', user?.id] })
            toast.success('Pet removed successfully.')
            setPendingDeleteId(null)
        },
        onError: () => {
            toast.error('Failed to delete pet. Please try again.')
            setPendingDeleteId(null)
        },
    })

    const pendingPet = pets?.find((p) => p.id === pendingDeleteId)

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">

            {/* ── Header ───────────────────────────────────────────────────────── */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Pets</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage all your pets in one place.
                    </p>
                </div>
                <Button onClick={() => navigate('/pets/new')} className="shrink-0">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Pet
                </Button>
            </div>

            <Separator />

            {/* ── Content ──────────────────────────────────────────────────────── */}
            {isLoading && (
                <div className="space-y-4">
                    <PetCardSkeleton />
                    <PetCardSkeleton />
                    <PetCardSkeleton />
                </div>
            )}

            {isError && (
                <Card className="border-destructive/30 bg-destructive/5">
                    <CardContent className="pt-6 pb-6 text-center">
                        <p className="text-sm text-destructive font-medium">Failed to load pets.</p>
                        <p className="text-xs text-muted-foreground mt-1">Check your connection and try again.</p>
                    </CardContent>
                </Card>
            )}

            {!isLoading && !isError && pets?.length === 0 && (
                <EmptyState onAdd={() => navigate('/pets/new')} />
            )}

            {!isLoading && !isError && pets && pets.length > 0 && (
                <div className="space-y-4">
                    {pets.map((pet) => (
                        <PetCard
                            key={pet.id}
                            pet={pet}
                            onEdit={() => navigate(`/pets/${pet.id}/edit`)}
                            onDelete={() => setPendingDeleteId(pet.id)}
                        />
                    ))}
                </div>
            )}

            {/* ── Delete confirmation dialog ────────────────────────────────────── */}
            <AlertDialog
                open={pendingDeleteId !== null}
                onOpenChange={(open) => { if (!open) setPendingDeleteId(null) }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete {pendingPet?.name ?? 'this pet'}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently remove <strong>{pendingPet?.name}</strong> and all associated
                            data. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={deleteMutation.isPending}
                            onClick={() => pendingDeleteId !== null && deleteMutation.mutate(pendingDeleteId)}
                        >
                            {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    )
}