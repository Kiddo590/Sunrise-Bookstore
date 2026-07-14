import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getOtherProducts } from '@/lib/db'
import CheckoutForm from './CheckoutForm'

export default async function CheckoutPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/checkout')

  const meta = user.user_metadata as { full_name?: string; phone?: string }

  const otherProducts = await getOtherProducts()
  const suggestedProducts = otherProducts
    .filter(p => p.in_stock)
    .sort((a, b) => a.price_kes - b.price_kes)
    .slice(0, 3)

  return (
    <CheckoutForm
      userId={user.id}
      defaultName={meta.full_name ?? ''}
      defaultPhone={meta.phone ?? ''}
      defaultEmail={user.email ?? ''}
      suggestedProducts={suggestedProducts}
    />
  )
}
