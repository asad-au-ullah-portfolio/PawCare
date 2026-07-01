import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import type { LoginRequest } from '../../services/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
    FieldGroup,
} from "@/components/ui/field"
import { FormInput } from "@/components/form/FormInput";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(1, 'Password is required'),
})

type FormData = z.infer<typeof schema>

// ─── Component ────────────────────────────────────────────────────────────────

export function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()

    const form = useForm<FormData>({ resolver: zodResolver(schema) })

    const mutation = useMutation({
        mutationFn: (data: LoginRequest) => login(data),
        onSuccess: () => navigate('/dashboard'),
    })

    const onSubmit = (data: FormData) => mutation.mutate(data)

    const errorMessage = mutation.error
        ? axios.isAxiosError(mutation.error) && mutation.error.response?.status === 401
            ? 'Invalid email or password.'
            : 'Something went wrong. Please try again.'
        : null

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-teal-600">PawCare</h1>
                    <p className="text-muted-foreground mt-2">Sign in to your account</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Sign in</CardTitle>
                        <CardDescription>Enter your email and password to continue.</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)}>

                            <FieldGroup>
                                <FormInput
                                    control={form.control}
                                    name="email"
                                    label="Email"
                                    type="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                />

                                <FormInput
                                    control={form.control}
                                    name="password"
                                    label="Password"
                                    type="password"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                            </FieldGroup>

                            {errorMessage && (
                                <p className="text-destructive text-sm mt-4 text-center">
                                    {errorMessage}
                                </p>
                            )}

                            <Button
                                type="submit"
                                className="w-full mt-6"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? "Signing in…" : "Sign in"}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="justify-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-teal-600 font-medium hover:underline">
                                Create one
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}