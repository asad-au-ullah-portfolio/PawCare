import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import {
    Calendar,
    Dog,
    Stethoscope,
    CheckCircle,
    Star,
    X,
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const steps = [
    {
        n: '01',
        title: 'Create an Account',
        description: 'Register as a pet owner in less than a minute.',
    },
    {
        n: '02',
        title: 'Add Your Pet',
        description: 'Create a profile for each of your pets.',
    },
    {
        n: '03',
        title: 'Choose a Veterinarian',
        description:
            'Browse available veterinarians and select the one that fits your needs.',
    },
    {
        n: '04',
        title: 'Book an Appointment',
        description:
            'Pick a convenient date and time, then manage your appointments anytime.',
    },
];

const features = [
    {
        icon: <Dog className="w-6 h-6 text-amber-500" />,
        title: 'Manage Your Pets',
        description:
            'Keep all your pets organized with profiles containing essential information for future appointments.',
    },
    {
        icon: <Stethoscope className="w-6 h-6 text-amber-500" />,
        title: 'Find Experienced Veterinarians',
        description:
            "Browse veterinarians by specialty and choose the right professional for your pet's needs.",
    },
    {
        icon: <Calendar className="w-6 h-6 text-amber-500" />,
        title: 'Book Appointments Online',
        description:
            'Schedule appointments in just a few clicks and view all upcoming visits from your dashboard.',
    },
];

const stats = [
    { emoji: '🐶', value: '500+', label: 'Pets Registered' },
    { emoji: '👨‍⚕️', value: '5', label: 'Veterinary Specialists' },
    { emoji: '📅', value: '1,000+', label: 'Appointments Booked' },
];

const whyItems = [
    'Simple and intuitive booking experience',
    'Secure account and pet management',
    'Experienced veterinary professionals',
    'Built to make pet healthcare more accessible',
];

const testimonials = [
    {
        text: 'Booking an appointment took less than two minutes.',
        author: 'Sarah M.',
    },
    {
        text: 'Finally, a simple way to manage all my pets.',
        author: 'James R.',
    },
    {
        text: 'The interface is clean, fast, and easy to use.',
        author: 'Emily K.',
    },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [showDemoNotice, setShowDemoNotice] = useState(true);

    return (
        <div className="min-h-screen bg-white text-slate-900">

            {/* ── Demo Notice Banner ─────────────────────────────────────────── */}
            {showDemoNotice && (
                <div className="bg-amber-100 px-4 py-3 border-b border-amber-200">
                    <div className="max-w-3xl mx-auto flex items-start sm:items-center justify-between gap-4">
                        <p className="text-sm text-amber-900 leading-relaxed">
                            <span className="mr-1">🚧</span>
                            <strong>Demo Notice:</strong> The backend runs on free hosting and may require up to 60 seconds to wake up after inactivity.
                        </p>
                        <button
                            onClick={() => setShowDemoNotice(false)}
                            className="p-1 rounded-md text-amber-700 hover:bg-amber-200/50 transition-colors shrink-0"
                            aria-label="Dismiss notice"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* ── Hero ─────────────────────────────────────────────────────────── */}
            <section className="px-6 py-24 md:py-32 text-center max-w-3xl mx-auto">
                {/* Badge */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium mb-8">
                    🐾 Trusted veterinary appointment platform
                </span>

                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight mb-6">
                    Quality Veterinary Care<br className="hidden md:block" /> Starts Here.
                </h1>

                <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto">
                    Book appointments with experienced veterinarians, manage your pets in one place,
                    and stay organized with a simple, modern healthcare platform built for pet owners.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button size="lg" onClick={() => navigate(isAuthenticated ? '/veterinarians' : '/register')} className="px-8">
                        Book an Appointment
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => navigate('/veterinarians')} className="px-8">
                        Browse Veterinarians
                    </Button>
                </div>
            </section>

            {/* ── How It Works ─────────────────────────────────────────────────── */}
            <section className="bg-slate-50 px-6 py-20">
                <div className="max-w-5xl mx-auto">
                    <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 text-center mb-2">
                        How It Works
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-14">
                        From sign-up to appointment<br className="hidden md:block" /> in four simple steps
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step) => (
                            <div key={step.n} className="flex flex-col">
                                <span className="text-5xl font-black text-amber-400 leading-none mb-4 select-none">
                                    {step.n}
                                </span>
                                <h3 className="text-base font-semibold text-slate-900 mb-2">{step.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features ─────────────────────────────────────────────────────── */}
            <section className="px-6 py-20">
                <div className="max-w-5xl mx-auto">
                    <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 text-center mb-2">
                        Features
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-14">
                        Everything you need,<br className="hidden md:block" /> nothing you don't
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((f) => (
                            <div
                                key={f.title}
                                className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50 mb-5">
                                    {f.icon}
                                </div>
                                <h3 className="text-base font-semibold text-slate-900 mb-2">{f.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Statistics ───────────────────────────────────────────────────── */}
            <section className="bg-slate-900 px-6 py-16">
                <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
                    {stats.map((s) => (
                        <div key={s.label}>
                            <div className="text-3xl mb-3">{s.emoji}</div>
                            <div className="text-4xl font-black text-white mb-1">{s.value}</div>
                            <div className="text-sm text-slate-400 font-medium">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Why PawCare ──────────────────────────────────────────────────── */}
            <section className="px-6 py-20">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-2">
                            Why PawCare
                        </p>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                            Pet healthcare<br /> made simpler.
                        </h2>
                        <p className="text-slate-500 leading-relaxed">
                            We built PawCare around one idea: getting your pet the care they need shouldn't be complicated.
                            Everything on the platform is designed to remove friction so you can focus on what matters — your pet.
                        </p>
                    </div>
                    <ul className="space-y-4">
                        {whyItems.map((item) => (
                            <li key={item} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                                <span className="text-slate-700 text-sm leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ── Testimonials ─────────────────────────────────────────────────── */}
            <section className="bg-slate-50 px-6 py-20">
                <div className="max-w-5xl mx-auto">
                    <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 text-center mb-2">
                        Trusted by Pet Owners
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-14">
                        What pet owners are saying
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((t) => (
                            <div
                                key={t.author}
                                className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm flex flex-col gap-4"
                            >
                                <div className="flex gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-slate-700 text-sm leading-relaxed flex-1">
                                    "{t.text}"
                                </p>
                                <p className="text-xs font-semibold text-slate-400">— {t.author}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Banner ───────────────────────────────────────────────────── */}
            <section className="px-6 py-20 text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Ready to take care of your pet?
                    </h2>
                    <p className="text-slate-500 mb-8 leading-relaxed">
                        Join PawCare today and schedule your first veterinary appointment in minutes.
                    </p>
                    <Button size="lg" onClick={() => navigate(isAuthenticated ? '/veterinarians' : '/register')} className="px-10">
                        Get Started
                    </Button>
                </div>
            </section>

            {/* ── Footer ───────────────────────────────────────────────────────── */}
            <footer className="border-t border-slate-100 px-6 py-10">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🐾</span>
                        <span className="font-bold text-slate-900">PawCare</span>
                    </div>
                    <p className="text-sm text-slate-400">
                        © {new Date().getFullYear()} PawCare. Built for pet owners.
                    </p>
                    <div className="flex gap-6 text-sm text-slate-500">
                        <button onClick={() => navigate('/veterinarians')} className="hover:text-slate-900 transition-colors">
                            Veterinarians
                        </button>
                        <button onClick={() => navigate('/register')} className="hover:text-slate-900 transition-colors">
                            Register
                        </button>
                        <button onClick={() => navigate('/login')} className="hover:text-slate-900 transition-colors">
                            Login
                        </button>
                    </div>
                </div>
            </footer>

        </div>
    );
}