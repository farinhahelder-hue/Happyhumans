'use client'
import { useState, useEffect } from 'react'

type Slot = { id: string; slot_date: string; slot_time: string; slot_type: string; duration_minutes: number }

const TYPE_LABELS: Record<string, string> = {
  discovery: 'Séance découverte — Gratuit — 45 min',
  coaching:  'Séance coaching — 120 € — 45 min',
  enterprise: 'Coaching entreprises — sur devis',
}

const TYPE_COLORS: Record<string, string> = {
  discovery:  'bg-emerald-50 text-emerald-800 border-emerald-200',
  coaching:   'bg-amber-50 text-amber-800 border-amber-200',
  enterprise: 'bg-stone-100 text-stone-700 border-stone-200',
}

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

function formatTime(t: string) { return t.slice(0, 5) }

type Step = 'pick-slot' | 'form' | 'success'

export default function BookingWidget({ defaultType }: { defaultType?: string }) {
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [step, setStep] = useState<Step>('pick-slot')
  const [filter, setFilter] = useState(defaultType || 'all')
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/booking')
      .then(r => r.json())
      .then(d => { setSlots(d.slots || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? slots : slots.filter(s => s.slot_type === filter)

  // Grouper par date
  const byDate = filtered.reduce<Record<string, Slot[]>>((acc, s) => {
    const k = s.slot_date
    if (!acc[k]) acc[k] = []
    acc[k].push(s)
    return acc
  }, {})

  const handleBook = async () => {
    if (!selectedSlot) return
    if (!form.name || !form.email) { setError('Nom et email requis.'); return }
    setSending(true); setError('')
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slot_id: selectedSlot.id, client_name: form.name, client_email: form.email, client_phone: form.phone, message: form.message }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erreur. Veuillez réessayer.'); setSending(false); return }
      setStep('success')
    } catch { setError('Erreur réseau. Veuillez réessayer.'); }
    finally { setSending(false) }
  }

  if (loading) return (
    <div className="flex justify-center py-12">
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#2f6b61] border-t-transparent" />
    </div>
  )

  if (step === 'success') return (
    <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-10 text-center">
      <div className="text-4xl mb-3">✅</div>
      <h3 className="text-lg font-semibold text-stone-900 mb-2">Demande envoyée !</h3>
      <p className="text-sm text-stone-600 mb-1">
        Votre demande pour le <strong>{selectedSlot ? formatDate(selectedSlot.slot_date) : ''}</strong> à <strong>{selectedSlot ? formatTime(selectedSlot.slot_time) : ''}</strong> a bien été reçue.
      </p>
      <p className="text-sm text-stone-500">Monica vous confirmera sous 48h à l&apos;adresse <strong>{form.email}</strong>.</p>
    </div>
  )

  if (step === 'form' && selectedSlot) return (
    <div className="max-w-lg mx-auto">
      <button onClick={() => { setStep('pick-slot'); setSelectedSlot(null) }} className="mb-6 flex items-center gap-1 text-sm text-[#2f6b61] hover:underline">
        ← Changer de créneau
      </button>
      <div className={`mb-6 rounded-xl border px-5 py-4 ${TYPE_COLORS[selectedSlot.slot_type] || 'bg-stone-50 border-stone-200'}`}>
        <p className="text-sm font-semibold">{TYPE_LABELS[selectedSlot.slot_type] || selectedSlot.slot_type}</p>
        <p className="text-sm mt-0.5">{formatDate(selectedSlot.slot_date)} à {formatTime(selectedSlot.slot_time)}</p>
      </div>
      <div className="space-y-4">
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Nom *</label>
            <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#2f6b61]" placeholder="Votre nom" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Email *</label>
            <input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#2f6b61]" placeholder="votre@email.com" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Téléphone</label>
          <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#2f6b61]" placeholder="+33 6 …" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Message <span className="normal-case font-normal text-stone-400">(optionnel)</span></label>
          <textarea value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} rows={3} className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#2f6b61] resize-none" placeholder="Contexte, questions, ce qui vous amène…" />
        </div>
        <button onClick={handleBook} disabled={sending} className="w-full rounded-full bg-[#2f6b61] py-3.5 text-sm font-semibold text-white hover:bg-[#235249] disabled:opacity-60 transition">
          {sending ? 'Envoi en cours…' : 'Confirmer ma demande'}
        </button>
        <p className="text-center text-xs text-stone-400">Monica confirme sous 48h · Sans engagement</p>
      </div>
    </div>
  )

  // step = 'pick-slot'
  const slotTypes = Array.from(new Set(slots.map(s => s.slot_type)))

  return (
    <div>
      {/* Filtres */}
      {slotTypes.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          <button onClick={() => setFilter('all')} className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition ${filter === 'all' ? 'bg-[#2f6b61] text-white border-[#2f6b61]' : 'bg-white text-stone-600 border-stone-200 hover:border-[#2f6b61]'}`}>
            Tous les types
          </button>
          {slotTypes.map(t => (
            <button key={t} onClick={() => setFilter(t)} className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition ${filter === t ? 'bg-[#2f6b61] text-white border-[#2f6b61]' : 'bg-white text-stone-600 border-stone-200 hover:border-[#2f6b61]'}`}>
              {t === 'discovery' ? 'Découverte' : t === 'coaching' ? 'Coaching' : 'Entreprises'}
            </button>
          ))}
        </div>
      )}

      {/* Grille créneaux par date */}
      {Object.keys(byDate).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-stone-500 mb-2">Aucun créneau disponible pour le moment.</p>
          <a href="/contact" className="text-sm font-semibold text-[#2f6b61] hover:underline">Nous contacter directement →</a>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(byDate).map(([date, daySlots]) => (
            <div key={date}>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-400 capitalize">{formatDate(date)}</p>
              <div className="flex flex-wrap gap-2">
                {daySlots.map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => { setSelectedSlot(slot); setStep('form') }}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition hover:shadow-sm ${TYPE_COLORS[slot.slot_type] || 'bg-stone-50 border-stone-200 text-stone-700'} hover:opacity-80`}
                  >
                    {formatTime(slot.slot_time)}
                    <span className="ml-2 text-xs opacity-70">{slot.duration_minutes} min</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
