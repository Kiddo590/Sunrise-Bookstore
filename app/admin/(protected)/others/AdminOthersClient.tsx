'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Plus, X } from 'lucide-react'
import { money } from '@/lib/format'
import type { OtherProduct } from '@/types'

const BLANK = { name: '', category: '', price_kes: '', description: '', cover_url: '', cover_public_id: '', in_stock: true }

export default function AdminOthersClient({ products: initial }: { products: OtherProduct[] }) {
  const [products, setProducts] = useState(initial)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<OtherProduct | null>(null)
  const [form, setForm] = useState(BLANK)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function openNew() {
    setEditing(null)
    setForm(BLANK)
    setFormOpen(true)
  }

  function openEdit(p: OtherProduct) {
    setEditing(p)
    setForm({
      name: p.name,
      category: p.category ?? '',
      price_kes: String(p.price_kes),
      description: p.description ?? '',
      cover_url: p.cover_url ?? '',
      cover_public_id: p.cover_public_id ?? '',
      in_stock: p.in_stock,
    })
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditing(null)
    setForm(BLANK)
  }

  async function uploadImage(file: File) {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const json = await res.json()
    setUploading(false)
    if (json.url) {
      setForm(f => ({ ...f, cover_url: json.url, cover_public_id: json.public_id ?? '' }))
    } else {
      toast.error('Image upload failed')
    }
  }

  async function handleSave() {
    if (!form.name.trim() || !form.price_kes) {
      toast.error('Name and price are required')
      return
    }
    setSaving(true)
    const payload = {
      name: form.name.trim(),
      category: form.category.trim() || null,
      price_kes: parseFloat(form.price_kes),
      description: form.description.trim() || null,
      cover_url: form.cover_url || null,
      cover_public_id: form.cover_public_id || null,
      in_stock: form.in_stock,
    }
    if (editing) {
      const res = await fetch(`/api/other-products/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const updated = await res.json()
        setProducts(prev => prev.map(p => p.id === editing.id ? updated : p))
        toast.success('Product updated')
        closeForm()
      } else {
        toast.error('Failed to update')
      }
    } else {
      const res = await fetch('/api/other-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const created = await res.json()
        setProducts(prev => [created, ...prev])
        toast.success('Product added')
        closeForm()
      } else {
        toast.error('Failed to add product')
      }
    }
    setSaving(false)
  }

  async function toggleStock(id: string, value: boolean) {
    const res = await fetch(`/api/other-products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ in_stock: value }),
    })
    if (res.ok) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, in_stock: value } : p))
    } else {
      toast.error('Failed to update')
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product? This cannot be undone.')) return
    const res = await fetch(`/api/other-products/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setProducts(prev => prev.filter(p => p.id !== id))
      toast.success('Product deleted')
    } else {
      toast.error('Failed to delete')
    }
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted">{products.length} product{products.length !== 1 ? 's' : ''}</p>
        {!formOpen && (
          <button
            onClick={openNew}
            className="flex items-center gap-1.5 bg-rust text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-rust-d transition-colors"
          >
            <Plus size={15} /> Add Product
          </button>
        )}
      </div>

      {/* Inline form */}
      {formOpen && (
        <div className="bg-paper2 border border-line rounded-xl p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-ink">{editing ? 'Edit Product' : 'New Product'}</h2>
            <button onClick={closeForm} className="text-muted hover:text-ink"><X size={18} /></button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-1">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Ballpoint Pen Set"
                className="w-full border border-line rounded-xl px-3 py-2 text-sm bg-paper focus:outline-none focus:border-rust"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-1">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                placeholder="e.g. Stationery, Electronics"
                className="w-full border border-line rounded-xl px-3 py-2 text-sm bg-paper focus:outline-none focus:border-rust"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-1">Price (KSh) *</label>
              <input
                type="number"
                min="0"
                value={form.price_kes}
                onChange={e => setForm(f => ({ ...f, price_kes: e.target.value }))}
                placeholder="e.g. 150"
                className="w-full border border-line rounded-xl px-3 py-2 text-sm bg-paper focus:outline-none focus:border-rust"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.in_stock}
                  onChange={e => setForm(f => ({ ...f, in_stock: e.target.checked }))}
                  className="accent-rust w-4 h-4"
                />
                <span className="text-sm font-medium text-ink">In Stock</span>
              </label>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Short product description (optional)"
                rows={2}
                className="w-full border border-line rounded-xl px-3 py-2 text-sm bg-paper focus:outline-none focus:border-rust resize-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-1">Cover Image</label>
              <div className="flex items-center gap-3">
                {form.cover_url && (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-line shrink-0">
                    <Image src={form.cover_url} alt="cover" fill className="object-cover" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="text-sm border border-line rounded-xl px-3 py-2 hover:bg-paper transition-colors disabled:opacity-50"
                >
                  {uploading ? 'Uploading…' : form.cover_url ? 'Change image' : 'Upload image'}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-5">
            <button
              onClick={handleSave}
              disabled={saving || uploading}
              className="bg-rust text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-rust-d transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Add product'}
            </button>
            <button onClick={closeForm} className="text-sm text-muted hover:text-ink px-3 py-2">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Products table */}
      <div className="bg-paper2 border border-line rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-paper">
                <th className="text-left p-3 text-muted font-semibold">Image</th>
                <th className="text-left p-3 text-muted font-semibold">Name</th>
                <th className="text-left p-3 text-muted font-semibold">Category</th>
                <th className="text-left p-3 text-muted font-semibold">Price</th>
                <th className="text-center p-3 text-muted font-semibold">In Stock</th>
                <th className="text-left p-3 text-muted font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted">
                    No products yet. Click "Add Product" to get started.
                  </td>
                </tr>
              ) : products.map(p => (
                <tr key={p.id} className="border-b border-line last:border-0 hover:bg-paper transition-colors">
                  <td className="p-3">
                    {p.cover_url ? (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-line">
                        <Image src={p.cover_url} alt={p.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-paper2 border border-line flex items-center justify-center text-xl">
                        🛍️
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <p className="font-medium text-ink">{p.name}</p>
                    {p.description && <p className="text-muted text-xs line-clamp-1">{p.description}</p>}
                  </td>
                  <td className="p-3 text-muted text-xs">{p.category ?? '—'}</td>
                  <td className="p-3 font-semibold text-ink">{money(p.price_kes)}</td>
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={p.in_stock}
                      onChange={e => toggleStock(p.id, e.target.checked)}
                      className="accent-rust w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="text-xs font-semibold text-ink border border-line px-2.5 py-1 rounded-full hover:bg-paper2 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
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
    </div>
  )
}
