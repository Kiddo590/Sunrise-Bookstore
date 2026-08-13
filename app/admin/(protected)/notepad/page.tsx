import { createServiceClient } from '@/lib/supabase/server'
import NotepadClient from './NotepadClient'

export default async function AdminNotepadPage() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'homepage_notepad')
    .single()

  let enabled = false
  let text = ''
  if (data?.value) {
    try {
      const parsed = JSON.parse(data.value)
      enabled = !!parsed.enabled
      text = parsed.text ?? ''
    } catch {}
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="font-display font-bold text-ink text-2xl">📝 Notepad</h1>
        <p className="text-muted text-sm mt-1">
          A small note shown on the homepage, on the right below Top Selling. Use it for daily quotes, reminders, or anything you want shoppers to see.
        </p>
      </div>

      <NotepadClient initialEnabled={enabled} initialText={text} />
    </div>
  )
}
