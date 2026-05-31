import { createServiceClient } from '@/lib/supabase/server'
import HeroSlidesClient from './HeroSlidesClient'
import type { HeroSlide } from '@/types'

export default async function HeroSlidesPage() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('hero_slides')
    .select('*')
    .order('position', { ascending: true })

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="font-display font-bold text-ink text-2xl">Hero Slides</h1>
        <p className="text-muted text-sm mt-1">
          The rotating banner at the top of the homepage. Each slide has a label, heading, description, button, background colour, and emoji. Falls back to the built-in defaults if empty.
        </p>
      </div>
      <HeroSlidesClient slides={(data as HeroSlide[]) ?? []} />
    </div>
  )
}
