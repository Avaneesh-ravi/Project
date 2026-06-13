'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, Crown } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { supabase } from '@/lib/supabase'

function OrderForm() {
    const searchParams = useSearchParams()
    const serviceName = searchParams.get('service') || 'Our Service'
    const servicePrice = searchParams.get('price') || 'Custom'

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        business: '',
        message: '',
    })
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setErrorMsg('')
        try {
            const { error } = await supabase.from('orders').insert({
                type: 'service_order',
                name: form.name,
                email: form.email,
                phone: form.phone,
                business: form.business,
                requirements: form.message,
                service: serviceName,
                price: servicePrice,
                status: 'New',
            })
            if (error) throw error
            setSubmitted(true)
        } catch (err) {
            setErrorMsg('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-red-300 mb-6">
                    <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="text-3xl font-black text-white mb-3">Order Received!</h2>
                <p className="text-white/70 max-w-md mb-8">
                    Thank you! We've received your order for <span className="text-red-300 font-semibold">{serviceName}</span>. Our team will contact you within 24 hours.
                </p>
                <Link
                    href="/services"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-7 py-3.5 font-semibold text-white transition hover:scale-[1.02]"
                >
                    Back to Services
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6">
            <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition mb-10"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Services
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-red-200 backdrop-blur-md mb-6">
                <Crown className="h-3.5 w-3.5" />
                Place Your Order
            </div>

            <h1 className="text-4xl font-black text-white mb-2">
                Order <span className="text-red-400">{serviceName}</span>
            </h1>
            <p className="text-white/60 mb-2">
                Starting at <span className="text-white font-semibold">{servicePrice}</span>
            </p>
            <p className="text-white/50 text-sm mb-10">
                Fill in your details and we'll get back to you within 24 hours.
            </p>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-8 backdrop-blur-xl shadow-[0_20px_70px_rgba(0,0,0,0.28)]">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Full Name *</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={form.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 backdrop-blur-md outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Email Address *</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 backdrop-blur-md outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition"
                            />
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Phone Number *</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="+91 98765 43210"
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 backdrop-blur-md outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Business Name</label>
                            <input
                                type="text"
                                name="business"
                                value={form.business}
                                onChange={handleChange}
                                placeholder="Your Company"
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 backdrop-blur-md outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">Selected Service</label>
                        <input
                            type="text"
                            value={`${serviceName} — ${servicePrice}`}
                            readOnly
                            className="w-full rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-red-200 backdrop-blur-md outline-none cursor-default"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">Project Details</label>
                        <textarea
                            name="message"
                            rows={4}
                            value={form.message}
                            onChange={handleChange}
                            placeholder="Describe your project, requirements, or any questions..."
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 backdrop-blur-md outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition resize-none"
                        />
                    </div>

                    {errorMsg && (
                        <p className="text-red-400 text-sm text-center">{errorMsg}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-7 py-4 font-semibold text-white shadow-[0_20px_65px_rgba(220,38,38,0.35)] transition hover:scale-[1.02] hover:from-red-500 hover:to-red-400 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {loading ? 'Submitting...' : 'Submit Order'}
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </form>
            </div>
        </div>
    )
}

export default function OrderPage() {
    return (
        <main className="min-h-screen bg-[#080808] text-white">
            <Navbar />
            <Suspense fallback={<div className="min-h-screen bg-[#080808]" />}>
                <OrderForm />
            </Suspense>
            <Footer />
        </main>
    )
}