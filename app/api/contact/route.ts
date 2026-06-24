import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, message, type = 'contact' } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'name, email et message sont requis' }, { status: 400 })
    }

    const supabase = getSupabase()
    if (!supabase) {
      // Supabase pas encore configuré — on répond OK quand même pour ne pas bloquer
      return NextResponse.json({ success: true })
    }

    const { error } = await supabase
      .from('contact_messages')
      .insert({ name, email, message, type, status: 'unread' })

    if (error) {
      console.error('contact insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Email de confirmation au visiteur + notification Monica
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://happy-humans.org'
    Promise.all([
      fetch(`${base}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'contact_confirmation', to: email, data: { name } }),
      }),
      fetch(`${base}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'booking_admin',
          to: process.env.ADMIN_EMAIL || 'happyhumans.coaching@gmail.com',
          data: { name, email, message },
        }),
      }),
    ]).catch(() => {})

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('contact error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
