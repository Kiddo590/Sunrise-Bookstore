'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { slugify } from '@/lib/format'
import type { BlogPost } from '@/types'

type FormState = {
  id?: string
  title: string
  slug: string
  excerpt: string
  body: string
  cover_url: string
  published: boolean
}

const emptyForm: FormState = { title: '', slug: '', excerpt: '', body: '', cover_url: '', published: false }

export default function AdminBlogClient({ posts: initial }: { posts: BlogPost[] }) {
  const [posts, setPosts] = useState(initial)
  const [form, setForm] = useState<FormState | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  function openNew() { setForm({ ...emptyForm }) }
  function openEdit(p: BlogPost) {
    setForm({ id: p.id, title: p.title, slug: p.slug, excerpt: p.excerpt ?? '', body: p.body ?? '', cover_url: p.cover_url ?? '', published: p.published })
  }

  async function togglePublished(id: string, published: boolean) {
    const res = await fetch('/api/blog', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, published }),
    })
    if (res.ok) setPosts(prev => prev.map(p => p.id === id ? { ...p, published } : p))
    else toast.error('Failed to update')
  }

  async function deletePost(id: string) {
    if (!confirm('Delete this post?')) return
    const res = await fetch('/api/blog', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) setPosts(prev => prev.filter(p => p.id !== id))
    else toast.error('Failed to delete')
  }

  async function uploadCover(file: File) {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) {
        setForm(f => f ? { ...f, cover_url: data.url } : f)
        toast.success('Cover uploaded!')
      } else toast.error('Upload failed')
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  async function save() {
    if (!form) return
    setSaving(true)
    try {
      const isNew = !form.id
      const res = await fetch('/api/blog', {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(form.id ? { id: form.id } : {}),
          title: form.title,
          slug: form.slug,
          excerpt: form.excerpt || null,
          body: form.body || null,
          cover_url: form.cover_url || null,
          published: form.published,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        if (isNew) {
          const newPost: BlogPost = {
            id: data.id,
            title: form.title,
            slug: form.slug,
            excerpt: form.excerpt || null,
            body: form.body || null,
            cover_url: form.cover_url || null,
            published: form.published,
            created_at: new Date().toISOString(),
          }
          setPosts(prev => [newPost, ...prev])
        } else {
          setPosts(prev => prev.map(p => p.id === form.id ? { ...p, ...form } : p))
        }
        toast.success(isNew ? 'Post created!' : 'Post updated!')
        setForm(null)
      } else {
        toast.error('Failed to save post')
      }
    } catch { toast.error('Something went wrong') }
    finally { setSaving(false) }
  }

  return (
    <div>
      <button
        onClick={openNew}
        className="mb-6 bg-rust text-white font-semibold px-5 py-2 rounded-full hover:bg-rust-d transition-colors text-sm"
      >
        + New Post
      </button>

      {/* Form */}
      {form && (
        <div className="bg-paper2 border border-line rounded-xl p-6 mb-6 max-w-2xl">
          <h2 className="font-display font-semibold text-ink text-lg mb-4">
            {form.id ? 'Edit Post' : 'New Post'}
          </h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-semibold text-ink block mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={e => {
                  const t = e.target.value
                  setForm(f => f ? { ...f, title: t, slug: f.id ? f.slug : slugify(t) } : f)
                }}
                className="w-full border border-line rounded-xl px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-rust"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink block mb-1">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={e => setForm(f => f ? { ...f, slug: e.target.value } : f)}
                className="w-full border border-line rounded-xl px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-rust font-mono"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink block mb-1">Excerpt</label>
              <input
                type="text"
                value={form.excerpt}
                onChange={e => setForm(f => f ? { ...f, excerpt: e.target.value } : f)}
                className="w-full border border-line rounded-xl px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-rust"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink block mb-1">Body</label>
              <textarea
                value={form.body}
                onChange={e => setForm(f => f ? { ...f, body: e.target.value } : f)}
                rows={8}
                className="w-full border border-line rounded-xl px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-rust resize-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink block mb-1">Cover image</label>
              {form.cover_url && (
                <p className="text-muted text-xs mb-1 truncate">{form.cover_url}</p>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={e => { const f = e.target.files?.[0]; if (f) uploadCover(f) }}
                className="text-sm text-muted"
                disabled={uploading}
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={e => setForm(f => f ? { ...f, published: e.target.checked } : f)}
                className="accent-rust w-4 h-4"
              />
              <span className="text-sm text-ink">Published</span>
            </label>
            <div className="flex gap-3">
              <button
                onClick={save}
                disabled={saving || uploading}
                className="bg-rust text-white font-semibold px-5 py-2 rounded-full hover:bg-rust-d transition-colors disabled:opacity-50 text-sm"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                onClick={() => setForm(null)}
                className="border border-line text-ink font-semibold px-5 py-2 rounded-full hover:bg-paper2 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-paper2 border border-line rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-paper">
              <th className="text-left p-3 text-muted font-semibold">Title</th>
              <th className="text-center p-3 text-muted font-semibold">Published</th>
              <th className="text-left p-3 text-muted font-semibold">Date</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} className="border-b border-line last:border-0 hover:bg-paper transition-colors">
                <td className="p-3 font-medium text-ink">{post.title}</td>
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={post.published}
                    onChange={e => togglePublished(post.id, e.target.checked)}
                    className="accent-rust w-4 h-4 cursor-pointer"
                  />
                </td>
                <td className="p-3 text-muted text-xs">
                  {new Date(post.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: '2-digit' })}
                </td>
                <td className="p-3 flex gap-2 justify-end">
                  <button
                    onClick={() => openEdit(post)}
                    className="text-xs font-semibold text-ink border border-line px-2.5 py-1 rounded-full hover:bg-paper2 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="text-xs font-semibold text-red-600 border border-red-200 px-2.5 py-1 rounded-full hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
