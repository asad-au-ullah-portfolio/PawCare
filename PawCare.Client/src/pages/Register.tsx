import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { RegisterRequest } from '../../services/api'
import axios from 'axios'

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Enter a valid email'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain an uppercase letter')
        .regex(/[0-9]/, 'Must contain a number'),
})

type FormData = z.infer<typeof schema>

// ─── Field config ─────────────────────────────────────────────────────────────

const fields: {
    name: keyof FormData
    label: string
    type: string
    placeholder: string
    autoComplete: string
    half?: boolean
}[] = [
        { name: 'firstName', label: 'First name', type: 'text', placeholder: 'Jane', autoComplete: 'given-name', half: true },
        { name: 'lastName', label: 'Last name', type: 'text', placeholder: 'Smith', autoComplete: 'family-name', half: true },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
        { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••', autoComplete: 'new-password' },
    ]

// ─── Component ────────────────────────────────────────────────────────────────

export function Register() {
    const { register: registerUser } = useAuth()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) })

    const mutation = useMutation({
        mutationFn: (data: RegisterRequest) => registerUser(data),
        onSuccess: () => navigate('/dashboard'),
    })

    const onSubmit = (data: FormData) => mutation.mutate(data)

    const errorMessage = mutation.error
        ? axios.isAxiosError(mutation.error) && mutation.error.response?.status === 409
            ? 'An account with this email already exists.'
            : 'Something went wrong. Please try again.'
        : null

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-teal-600">PawCare</h1>
                    <p className="text-gray-500 mt-2">Create your account</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            {fields
                                .filter((f) => f.half)
                                .map(({ name, label, type, placeholder, autoComplete }) => (
                                    <div key={name}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {label}
                                        </label>
                                        <input
                                            {...register(name)}
                                            type={type}
                                            autoComplete={autoComplete}
                                            placeholder={placeholder}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition"
                                        />
                                        {errors[name] && (
                                            <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>
                                        )}
                                    </div>
                                ))}
                        </div>

                        {fields
                            .filter((f) => !f.half)
                            .map(({ name, label, type, placeholder, autoComplete }) => (
                                <div key={name}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {label}
                                    </label>
                                    <input
                                        {...register(name)}
                                        type={type}
                                        autoComplete={autoComplete}
                                        placeholder={placeholder}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition"
                                    />
                                    {errors[name] && (
                                        <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>
                                    )}
                                </div>
                            ))}

                        {errorMessage && (
                            <p className="text-red-500 text-sm text-center">{errorMessage}</p>
                        )}

                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
                        >
                            {mutation.isPending ? 'Creating account…' : 'Create account'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-teal-600 font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}