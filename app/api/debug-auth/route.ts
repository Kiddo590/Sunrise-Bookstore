import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  const { data: { user },    error: userError }    = await supabase.auth.getUser()

  const adminEmail = process.env.ADMIN_EMAIL ?? '(not set)'

  return Response.json({
    session: session
      ? {
          exists: true,
          email: session.user.email,
          id: session.user.id,
          role: session.user.role,
          emailMatchesAdmin: session.user.email === process.env.ADMIN_EMAIL,
        }
      : { exists: false },
    user: user
      ? { email: user.email, id: user.id, role: user.role }
      : null,
    adminEmail,
    errors: {
      session: sessionError?.message ?? null,
      user:    userError?.message    ?? null,
    },
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/^(https:\/\/[a-z0-9]{6}).*/, '$1…')
      : '(not set)',
  })
}
