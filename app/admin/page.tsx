'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BadgeCheck, Clock3, Inbox, LayoutDashboard, LogIn, LogOut, UsersRound, User, Mail, Phone, Building2, MessageSquare, Lock } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Order = {
  id: string
  type: string
  name: string
  company: string
  email: string
  phone: string
  business: string
  org_type: string
  budget: string
  requirements: string
  service: string
  price: string
  status: string
  created_at: string
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [selected, setSelected] = useState<Order | null>(null)

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'brandnest2024') {
      setAuthed(true)
      setError('')
    } else {
      setError('Incorrect password')
    }
  }

  useEffect(() => {
    if (!authed) return
    const fetchOrders = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setOrders(data)
    }
    fetchOrders()
  }, [authed])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id)
    const updated = orders.map((o) => o.id === id ? { ...o, status } : o)
    setOrders(updated)
    if (selected?.id === id) setSelected({ ...selected, status })
  }

  const stats = [
    { label: 'Total Orders', value: orders.length.toString(), icon: Inbox },
    { label: 'Active', value: orders.filter(o => o.status !== 'Completed').length.toString(), icon: UsersRound },
    { label: 'Completed', value: orders.filter(o => o.status === 'Completed').length.toString(), icon: BadgeCheck },
  ]

  const statusColors: Record<string, string> = {
    New: 'bg-red-500/10 border-red-400/20 text-red-100',
    Review: 'bg-yellow-500/10 border-yellow-400/20 text-yellow-100',
    Queued: 'bg-blue-500/10 border-blue-400/20 text-blue-100',
    Completed: 'bg-green-500/10 border-green-400/20 text-green-100',
  }

  // Login screen
  if (!authed) {
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(220,38,38,0.28),transparent_30%)]" />
        <div className="relative z-10 w-full max-w-md">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-8 backdrop-blur-xl shadow-[0_20px_70px_rgba(0,0,0,0.4)]">
            <div className="flex flex-col items-center mb-8">
              <Image src="/brandnest-logo.png" alt="Brandnest" width={64} height={64} className="rounded-full mb-4 shadow-[0_0_45px_rgba(220,38,38,0.4)]" />
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-300">Brandnest Admin</p>
              <h1 className="text-2xl font-black text-white mt-1">Admin Login</h1>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter admin password"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition"
                />
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
              </div>
              <button
                onClick={handleLogin}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 font-semibold text-white transition hover:scale-[1.02]"
              >
                <Lock className="h-4 w-4" />
                Login
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-24 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_18%_10%,rgba(220,38,38,0.28),transparent_30%),linear-gradient(135deg,#050505,#160202_52%,#050505)]" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Image src="/brandnest-logo.png" alt="Brandnest logo" width={68} height={68} className="h-16 w-16 rounded-full object-cover shadow-[0_0_45px_rgba(220,38,38,0.4)]" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-300">Brandnest Admin</p>
              <h1 className="mt-1 text-4xl font-black text-white">Order Dashboard</h1>
            </div>
          </div>
          <button
            onClick={() => setAuthed(false)}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.055] px-5 py-3 text-sm font-semibold text-white backdrop-blur-xl hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {stats.map(({ label, value, icon: Icon }) => (
            <article key={label} className="rounded-[1.3rem] border border-white/10 bg-white/[0.055] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              <Icon className="h-7 w-7 text-red-300" />
              <p className="mt-5 text-4xl font-black text-white">{value}</p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.25em] text-white/55">{label}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 shadow-[0_25px_90px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <LayoutDashboard className="h-6 w-6 text-red-300" />
              <h2 className="text-2xl font-black text-white">Incoming Orders</h2>
            </div>
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-white/40">
                <Inbox className="h-12 w-12 mb-4" />
                <p className="text-lg font-semibold">No orders yet</p>
                <p className="text-sm mt-1">Orders will appear here when customers submit</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {orders.map((order) => (
                  <article
                    key={order.id}
                    onClick={() => setSelected(order)}
                    className={`cursor-pointer grid gap-4 rounded-2xl border p-5 transition sm:grid-cols-[1.1fr_0.9fr_0.7fr_0.7fr] sm:items-center ${selected?.id === order.id ? 'border-red-500/40 bg-red-500/5' : 'border-white/10 bg-black/20 hover:border-white/20'}`}
                  >
                    <div>
                      <p className="text-lg font-bold text-white">{order.service}</p>
                      <p className="mt-1 text-sm text-white/55">{order.name}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Clock3 className="h-4 w-4 text-red-300" />
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                    <span className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${statusColors[order.status] || statusColors['New']}`}>
                      {order.status}
                    </span>
                    <p className="font-semibold text-white">{order.price}</p>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-6 shadow-[0_25px_90px_rgba(0,0,0,0.34)] backdrop-blur-2xl">
            {selected ? (
              <>
                <h2 className="text-xl font-black text-white mb-1">{selected.service}</h2>
                <p className="text-red-300 font-semibold text-sm mb-6">{selected.price}</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                    <User className="h-4 w-4 text-red-300 shrink-0" />
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-widest">Name</p>
                      <p className="text-white font-semibold">{selected.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                    <Mail className="h-4 w-4 text-red-300 shrink-0" />
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-widest">Email</p>
                      <p className="text-white font-semibold">{selected.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                    <Phone className="h-4 w-4 text-red-300 shrink-0" />
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-widest">Phone</p>
                      <p className="text-white font-semibold">{selected.phone}</p>
                    </div>
                  </div>
                  {(selected.company || selected.business) && (
                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                      <Building2 className="h-4 w-4 text-red-300 shrink-0" />
                      <div>
                        <p className="text-xs text-white/40 uppercase tracking-widest">Company</p>
                        <p className="text-white font-semibold">{selected.company || selected.business}</p>
                      </div>
                    </div>
                  )}
                  {selected.requirements && (
                    <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                      <MessageSquare className="h-4 w-4 text-red-300 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-white/40 uppercase tracking-widest">Requirements</p>
                        <p className="text-white/80 text-sm mt-1">{selected.requirements}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Update Status</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['New', 'Review', 'Queued', 'Completed'].map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(selected.id, s)}
                        className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${selected.status === s ? 'border-red-500/50 bg-red-500/15 text-red-200' : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16 text-white/30">
                <LayoutDashboard className="h-12 w-12 mb-4" />
                <p className="text-lg font-semibold">Select an order</p>
                <p className="text-sm mt-1 text-center">Click any order to view full details</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}