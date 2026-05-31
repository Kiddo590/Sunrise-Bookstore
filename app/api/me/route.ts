import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return NextResponse.json({
    session: !!user,
    email: user?.email ?? null,
    adminEmail: process.env.ADMIN_EMAIL ?? '(not set)',
    emailMatch: user?.email === process.env.ADMIN_EMAIL,
  })
}
