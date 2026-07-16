import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    FieldGroup,
} from "@/components/ui/field";
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { RegisterRequest } from '../../services/api'
import axios from 'axios'

import { useForm } from "react-hook-form";
import { FormInput } from "@/components/form/FormInput";
import { PasswordInput } from "@/components/form/PasswordInput";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.email('Enter a valid email'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain an uppercase letter')
        .regex(/[a-z]/, 'Must contain a lowercase letter')
        .regex(/[0-9]/, 'Must contain a number')
        .regex(/[^a-zA-Z0-9]/, 'Must contain a special character'),
})

type FormData = z.infer<typeof schema>

// ─── Component ────────────────────────────────────────────────────────────────

export function Register() {
    const { register: registerUser } = useAuth()
    const navigate = useNavigate()

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
    });

    const mutation = useMutation({
        mutationFn: (data: RegisterRequest) => registerUser(data),
        onSuccess: () => navigate('/dashboard'),
    })

    const onSubmit = (data: FormData) => mutation.mutate(data)

    const errorMessage = mutation.error
        ? axios.isAxiosError(mutation.error) && mutation.error.response?.status === 400
            ? 'An account with this email already exists.'
            : 'Something went wrong. Please try again.'
        : null

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-teal-600">PawCare</h1>
                    <p className="text-muted-foreground mt-2">
                        Create your account
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Create account</CardTitle>
                        <CardDescription>
                            Enter your information to create your PawCare account.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <FieldGroup>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput
                                        control={form.control}
                                        name="firstName"
                                        label="First name"
                                        placeholder="Jane"
                                        autoComplete="given-name"
                                    />

                                    <FormInput
                                        control={form.control}
                                        name="lastName"
                                        label="Last name"
                                        placeholder="Smith"
                                        autoComplete="family-name"
                                    />
                                </div>

                                <FormInput
                                    control={form.control}
                                    name="email"
                                    label="Email"
                                    type="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                />

                                <PasswordInput
                                    control={form.control}
                                    name="password"
                                    label="Password"
                                />
                            </FieldGroup>

                            {errorMessage && (
                                <p className="text-destructive text-sm text-center">
                                    {errorMessage}
                                </p>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending
                                    ? "Creating account…"
                                    : "Create account"}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="justify-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-teal-600 font-medium hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}