import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminShell from '../AdminShell'

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')
  if (user.email !== process.env.ADMIN_EMAIL) redirect('/')

  return <AdminShell>{children}</AdminShell>
}
