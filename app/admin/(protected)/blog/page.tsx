import { createServiceClient } from '@/lib/supabase/server'
import AdminBlogClient from './AdminBlogClient'
import type { BlogPost } from '@/types'

export default async function AdminBlogPage() {
  const supabase = createServiceClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="font-display font-bold text-ink text-2xl mb-6">Blog Posts</h1>
      <AdminBlogClient posts={(posts as BlogPost[]) ?? []} />
    </div>
  )
}
