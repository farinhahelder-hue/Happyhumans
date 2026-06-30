// TODO: Réactiver le système inhouse de réservation si besoin
// Ce composant a été temporairement désactivé — utiliser Calendly uniquement
// Réactiver : décommenter ce fichier et vérifier les imports dans les pages

/*
'use client'
import { useState, useEffect, useMemo } from 'react'

type Slot = { id: string; slot_date: string; slot_time: string; slot_type: string; duration_minutes: number }

const TYPE_LABELS: Record<string, string> = {
  discovery: 'Séance découverte — Gratuite — 45 min',
  coaching:  'Séance coaching — 120 € — 45 min',
  enterprise: 'Coaching entreprises — sur devis',
}
const TYPE_COLORS: Record<string, string> = {
  discovery:  'bg-emerald-50 text-emerald-800 border-emerald-200',
  coaching:   'bg-amber-50 text-amber-800 border-amber-200',
  enterprise: 'bg-stone-100 text-stone-700 border-stone-200',
}
const TYPE_ACTIVE: Record<string, string> = {
  discovery:  'bg-emerald-700 text-white border-emerald-700',
  coaching:   'bg-amber-700 text-white border-amber-700',
  enterprise: 'bg-stone-700 text-white border-stone-700',
}

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}
function formatDateShort(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
}
function formatTime(t: string) { return t.slice(0, 5) }

function getWeekStart(offset = 0) {
  const d = new Date()
  d.setDate(d.getDate() - d.getDay() + 1 + offset * 7)
  return d.toISOString().split('T')[0]
}
function getWeekEnd(offset = 0) {
  const d = new Date()
  d.setDate(d.getDate() - d.getDay() + 7 + offset * 7)
  return d.toISOString().split('T')[0]
}

type Step = 'pick-slot' | 'form' | 'success'

export default function BookingWidget({ defaultType }: { defaultType?: string }) {
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [step, setStep] = useState<Step>('pick-slot')
  const [filter, setFilter] = useState(defaultType || 'discovery')
  const [weekOffset, setWeekOffset] = useState(0)
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/booking')
      .then(r => r.json())
      .then(d => { setSlots(d.slots || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Filtrer par type + semaine
  const weekStart = getWeekStart(weekOffset)
  const weekEnd   = getWeekEnd(weekOffset)

  const filtered = useMemo(() => {
    let s = filter === 'all' ? slots : slots.filter(s => s.slot_type === filter)
    s = s.filter(s => s.slot_date >= weekStart && s.slot_date <= weekEnd)
    return s
  }, [slots, filter, weekStart, weekEnd])

  const byDate = useMemo(() => filtered.reduce<Record<string, Slot[]>>((acc, s) => {
    if (!acc[s.slot_date]) acc[s.slot_date] = []
    acc[s.slot_date].push(s)
    return acc
  }, {}), [filtered])

  // Compter les semaines qui ont des créneaux
  const weeksWithSlots = useMemo(() => {
    const weeks = new Set<number>()
    slots.filter(s => filter === 'all' || s.slot_type === filter).forEach(s => {
      const d = new Date(s.slot_date + 'T00:00:00')
      const today = new Date(); today.setHours(0,0,0,0)
      const diffDays = Math.floor((d.getTime() - today.getTime()) / 86400000)
      weeks.add(Math.floor(diffDays / 7))
    })
    return weeks
  }, [slots, filter])

  const slotTypes = useMemo(() => Array.from(new Set(slots.map(s => s.slot_type))), [slots])

  const handleBook = async () => {
    if (!selectedSlot) return
    if (!form.name || !form.email) { setError('Nom et email requis.'); return }
    setSending(true); setError('')
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slot_id: selectedSlot.id,
          client_name: form.name,
          client_email: form.email,
          client_phone: form.phone,
          message: [form.subject ? `Sujet : ${form.subject}` : '', form.message].filter(Boolean).join('\n\n'),
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erreur. Veuillez réessayer.'); setSending(false); return }
      setStep('success')
    } catch { setError('Erreur réseau. Veuillez réessayer.') }
    finally { setSending(false) }
  }

  // ── État loading ───────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex justify-center py-12">
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#2f6b61] border-t-transparent" />
    </div>
  )

  // ── Succès ─────────────────────────────────────────────────────────────────
  if (step === 'success') return (
    <div className="rounded-2xl bg-[#eef5f3] border border-[#2d5f54]/20 p-10 text-center">
      <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[#2d5f54] flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-stone-900 mb-2">Demande envoyée !</h3>
      <p className="text-sm text-stone-600 mb-1">
        Votre demande pour le <strong>{selectedSlot ? formatDate(selectedSlot.slot_date) : ''}</strong> à <strong>{selectedSlot ? formatTime(selectedSlot.slot_time) : ''}</strong> a bien été reçue.
      </p>
      <p className="text-sm text-stone-500 mb-6">Monica vous confirmera sous 48h à <strong>{form.email}</strong>.</p>
      <button onClick={() => { setStep('pick-slot'); setSelectedSlot(null); setForm({ name:'', email:'', phone:'', subject:'', message:'' }) }}
        className="text-sm font-semibold text-[#2f6b61] hover:underline">
        Réserver un autre créneau →
      </button>
    </div>
  )

  // ── Formulaire ─────────────────────────────────────────────────────────────
  if (step === 'form' && selectedSlot) return (
    <div className="max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-6 text-xs text-stone-400">
        <span className="text-[#2f6b61] font-semibold">1. Créneau</span>
        <div className="flex-1 h-px bg-[#2f6b61]/30" />
        <span className="text-[#2f6b61] font-semibold">2. Vos informations</span>
        <div className="flex-1 h-px bg-stone-200" />
        <span>3. Confirmation</span>
      </div>

      <button onClick={() => { setStep('pick-slot'); setSelectedSlot(null) }}
        className="mb-5 flex items-center gap-1 text-sm text-[#2f6b61] hover:underline">
        ← Changer de créneau
      </button>

      {/* Résumé créneau */}
      <div className={`mb-6 rounded-xl border px-5 py-4 ${TYPE_COLORS[selectedSlot.slot_type] || 'bg-stone-50 border-stone-200'}`}>
        <p className="text-sm font-semibold">{TYPE_LABELS[selectedSlot.slot_type] || selectedSlot.slot_type}</p>
        <p className="text-sm mt-0.5">{formatDate(selectedSlot.slot_date)} à {formatTime(selectedSlot.slot_time)}</p>
      </div>

      <div className="space-y-4">
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Nom *</label>
            <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
              className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#2f6b61] transition-colors"
              placeholder="Votre nom complet" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Email *</label>
            <input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
              className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#2f6b61] transition-colors"
              placeholder="votre@email.com" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Téléphone <span className="normal-case font-normal text-stone-400">(optionnel)</span></label>
          <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}
            className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#2f6b61] transition-colors"
            placeholder="+33 6 …" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Ce qui vous amène <span className="normal-case font-normal text-stone-400">(aide Monica à se préparer)</span></label>
          <select value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))}
            className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#2f6b61] transition-colors bg-white">
            <option value="">Choisir un thème…</option>
            <option>Transition professionnelle</option>
            <option>Prise de poste / leadership</option>
            <option>Clarté de direction</option>
            <option>Relations et attachement</option>
            <option>Happiness Design</option>
            <option>Accompagnement entreprise</option>
            <option>Autre</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Message <span className="normal-case font-normal text-stone-400">(optionnel)</span></label>
          <textarea value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))}
            rows={3}
            className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#2f6b61] resize-none transition-colors"
            placeholder="Contexte, questions, ce qui vous amène en détail…" />
        </div>

        <button onClick={handleBook} disabled={sending}
          className="w-full rounded-full bg-[#2f6b61] py-3.5 text-sm font-semibold text-white hover:bg-[#235249] disabled:opacity-60 transition">
          {sending ? 'Envoi en cours…' : 'Confirmer ma demande →'}
        </button>
        <p className="text-center text-xs text-stone-400">Monica confirme sous 48h · Sans engagement · 100% confidentiel</p>
      </div>
    </div>
  )

  // ── Choix du créneau ──────────────────────────────────────────────────────
  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-2 mb-6 text-xs text-stone-400">
        <span className="text-[#2f6b61] font-semibold">1. Choisir un créneau</span>
        <div className="flex-1 h-px bg-stone-200" />
        <span>2. Vos informations</span>
        <div className="flex-1 h-px bg-stone-200" />
        <span>3. Confirmation</span>
      </div>

      {/* Filtres type */}
      {slotTypes.length > 1 && (
        <div className="mb-5 flex flex-wrap gap-2 justify-center">
          <button onClick={() => setFilter('all')}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition ${filter === 'all' ? 'bg-[#2f6b61] text-white border-[#2f6b61]' : 'bg-white text-stone-600 border-stone-200 hover:border-[#2f6b61]'}`}>
            Tous
          </button>
          {slotTypes.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition ${filter === t ? 'bg-[#2f6b61] text-white border-[#2f6b61]' : 'bg-white text-stone-600 border-stone-200 hover:border-[#2f6b61]'}`}>
              {t === 'discovery' ? 'Découverte' : t === 'coaching' ? 'Coaching' : 'Entreprises'}
            </button>
          ))}
        </div>
      )}

      {/* Navigation semaine */}
      <div className="flex items-center justify-between mb-5 bg-white rounded-xl px-4 py-2.5 border border-stone-100 shadow-sm">
        <button
          onClick={() => setWeekOffset(w => Math.max(0, w - 1))}
          disabled={weekOffset === 0}
          className="text-stone-400 hover:text-[#2f6b61] disabled:opacity-30 transition text-lg font-light px-2"
        >←</button>
        <span className="text-sm font-medium text-stone-700">
          {weekOffset === 0 ? 'Cette semaine' : weekOffset === 1 ? 'Semaine prochaine' : `Dans ${weekOffset} semaines`}
          <span className="ml-2 text-xs text-stone-400">
            {new Date(weekStart + 'T00:00:00').toLocaleDateString('fr-FR', { day:'numeric', month:'short' })}
            {' – '}
            {new Date(weekEnd + 'T00:00:00').toLocaleDateString('fr-FR', { day:'numeric', month:'short' })}
          </span>
        </span>
        <button
          onClick={() => setWeekOffset(w => w + 1)}
          className="text-stone-400 hover:text-[#2f6b61] transition text-lg font-light px-2"
        >→</button>
      </div>

      {/* Grille créneaux */}
      {Object.keys(byDate).length === 0 ? (
        <div className="text-center py-10 rounded-2xl border border-stone-100 bg-white">
          <p className="text-stone-500 mb-2 font-medium">Pas de créneau disponible cette semaine</p>
          <div className="flex gap-3 justify-center mt-4">
            {weekOffset > 0 && (
              <button onClick={() => setWeekOffset(0)} className="text-xs px-4 py-2 rounded-full border border-stone-200 hover:border-[#2f6b61] text-stone-600 hover:text-[#2f6b61] transition">
                ← Revenir à cette semaine
              </button>
            )}
            {Array.from(weeksWithSlots).filter(w => w > weekOffset).length > 0 && (
              <button onClick={() => setWeekOffset(Array.from(weeksWithSlots).filter(w => w > weekOffset).sort()[0])}
                className="text-xs px-4 py-2 rounded-full bg-[#2f6b61] text-white hover:bg-[#235249] transition">
                Prochain créneau disponible →
              </button>
            )}
          </div>
          <p className="text-xs text-stone-400 mt-4">
            Ou <a href="/contact" className="text-[#2f6b61] hover:underline font-semibold">contactez Monica directement</a>
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {Object.entries(byDate).sort(([a],[b]) => a.localeCompare(b)).map(([date, daySlots]) => (
            <div key={date} className="bg-white rounded-xl border border-stone-100 shadow-sm p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500 capitalize mb-3">
                {formatDate(date)}
              </p>
              <div className="flex flex-wrap gap-2">
                {daySlots.sort((a,b) => a.slot_time.localeCompare(b.slot_time)).map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => { setSelectedSlot(slot); setStep('form') }}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition hover:shadow-md active:scale-95 ${TYPE_COLORS[slot.slot_type] || 'bg-stone-50 border-stone-200 text-stone-700'}`}
                  >
                    {formatTime(slot.slot_time)}
                    <span className="ml-1.5 text-xs opacity-60">{slot.duration_minutes} min</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Aide */}
      <p className="text-center text-xs text-stone-400 mt-5">
        Séance découverte gratuite · Sans engagement · Confirmation sous 48h
      </p>
    </div>
  )
}
*/
