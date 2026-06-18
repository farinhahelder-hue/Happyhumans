'use client'

import { useState } from 'react'

export default function StayInTouchForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Adresse email invalide.')
      return
    }

    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setStatus('success')
        setMessage("C'est fait ! On reste en contact ✨")
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Une erreur est survenue.')
      }
    } catch {
      setStatus('error')
      setMessage('Connexion impossible. Réessaie dans quelques instants.')
    }
  }

  return (
    <section
      id="rester-en-contact"
      className="px-4 py-20 md:py-24"
      style={{ background: 'linear-gradient(135deg, #f5e8f5 0%, #ede8fa 100%)' }}
    >
      <div className="max-w-4xl mx-auto">
        <div
          className="rounded-3xl p-8 md:p-12 text-center shadow-xl"
          style={{ background: '#fff' }}
        >
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: '#a864a0' }}
          >
            Restons en lien
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a2e' }}
          >
            Vous voulez continuer <span style={{ color: '#a864a0' }}>avec Monica ?</span>
          </h2>
          <p className="max-w-lg mx-auto mb-8 leading-relaxed" style={{ color: '#666' }}>
            Recevez ses conseils, ressources et prochains événements directement par email.
            Une fois par mois, sans spam.
          </p>

          {status === 'success' ? (
            <div
              className="max-w-md mx-auto rounded-2xl px-6 py-5"
              style={{ background: '#f5e8f5' }}
            >
              <p className="font-semibold" style={{ color: '#7c3d8f' }}>
                {message}
              </p>
              <p className="text-sm mt-1" style={{ color: '#888' }}>
                Vous serez la première informée des prochains rendez-vous.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.fr"
                required
                className="flex-1 px-5 py-3.5 rounded-2xl text-base outline-none transition-all"
                style={{
                  background: '#f8f6f2',
                  border: '1px solid rgba(168,100,160,0.25)',
                  color: '#2c2c2c',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#a864a0'
                  e.target.style.boxShadow = '0 0 0 3px rgba(168,100,160,0.15)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(168,100,160,0.25)'
                  e.target.style.boxShadow = 'none'
                }}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-7 py-3.5 font-semibold rounded-2xl text-base transition-all disabled:opacity-60"
                style={{
                  background: '#a864a0',
                  color: '#fff',
                  boxShadow: '0 8px 24px rgba(168,100,160,0.35)',
                }}
              >
                {status === 'loading' ? '…' : 'Je reste en contact →'}
              </button>
            </form>
          )}

          {status === 'error' && (
            <p className="mt-3 text-sm" style={{ color: '#e53e3e' }}>
              {message}
            </p>
          )}

          <p className="mt-4 text-xs" style={{ color: '#aaa' }}>
            Pas de spam · Désabonnement en 1 clic · Monica ne partage jamais vos données
          </p>
        </div>
      </div>
    </section>
  )
}
