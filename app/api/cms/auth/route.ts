import { NextResponse } from 'next/server'
import {
  clearCmsSessionResponse,
  createCmsSessionResponse,
  getCmsAuthStatus,
  getCurrentSessionToken,
  isValidCmsPassword,
} from "@/lib/cms-auth"

export async function POST(req: Request) {
  const { password } = await req.json()

  if (!process.env.CMS_PASSWORD?.trim()) {
    return NextResponse.json(
      { error: "CMS non configuré : variable CMS_PASSWORD manquante." },
      { status: 503 }
    )
  }

  if (!isValidCmsPassword(password)) {
    return clearCmsSessionResponse(401, { error: "Mot de passe incorrect" })
  }

  return createCmsSessionResponse()
}

// GET /api/cms/auth — returns { ok, token } when authenticated
// Token can be passed as ?cms_edit_token=... to activate inline edit on the site
export async function GET(req: Request) {
  const status = getCmsAuthStatus(req)

  if (status === "misconfigured") {
    return NextResponse.json({ ok: false, error: "CMS non configuré" }, { status: 503 })
  }

  if (status !== "ok") return NextResponse.json({ ok: false }, { status: 401 })

  const token = getCurrentSessionToken(req)
  return NextResponse.json({ ok: true, token })
}

export async function DELETE() {
  return clearCmsSessionResponse()
}

export async function PUT() {
  const password = process.env.CMS_PASSWORD;
  return NextResponse.json({
    hasPassword: !!password,
    passwordLength: password?.length || 0,
    timestamp: new Date().toISOString()
  });
}
