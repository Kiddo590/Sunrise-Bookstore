/**
 * Data access layer. Returns mock data when Supabase is not configured
 * (NEXT_PUBLIC_SUPABASE_URL is empty), otherwise queries Supabase.
 */

import type { Book, Review, BlogPost, Order, BookRequestRecord, OtherProduct, HeroSlide } from '@/types'
import { MOCK_BOOKS, MOCK_REVIEWS, MOCK_BLOG_POSTS } from './mock-data'

function isConfigured() {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL
}

async function getSupabase() {
  const { createClient } = await import('./supabase/server')
  return createClient()
}

// ── Books ──────────────────────────────────────────────────

export async function getFeaturedBooks(): Promise<Book[]> {
  if (!isConfigured()) {
    return MOCK_BOOKS.filter(b => b.is_featured)
  }
  const sb = await getSupabase()
  const { data } = await sb.from('books').select('*').eq('is_featured', true).order('created_at', { ascending: false })
  return (data as Book[]) ?? []
}

export async function getEbookBooks(): Promise<Book[]> {
  if (!isConfigured()) {
    return MOCK_BOOKS.filter(b => b.price_ebook != null)
  }
  const sb = await getSupabase()
  const { data } = await sb.from('books').select('*').not('price_ebook', 'is', null).order('created_at', { ascending: false })
  return (data as Book[]) ?? []
}

export async function getLatestEbook(): Promise<Book | null> {
  if (!isConfigured()) {
    return MOCK_BOOKS.filter(b => b.price_ebook != null)[0] ?? null
  }
  const sb = await getSupabase()
  const { data } = await sb.from('books').select('*').not('price_ebook', 'is', null).order('created_at', { ascending: false }).limit(1)
  return (data?.[0] as Book) ?? null
}

export async function getDealBook(): Promise<Book | null> {
  if (!isConfigured()) {
    return MOCK_BOOKS.find(b => b.is_deal) ?? null
  }
  const sb = await getSupabase()
  const { data } = await sb.from('books').select('*').eq('is_deal', true).limit(1)
  return (data?.[0] as Book) ?? null
}

export async function getAllBooks(): Promise<Book[]> {
  if (!isConfigured()) {
    return MOCK_BOOKS
  }
  const sb = await getSupabase()
  const { data } = await sb.from('books').select('*').order('created_at', { ascending: false })
  return (data as Book[]) ?? []
}

export async function getBookById(id: string): Promise<Book | null> {
  if (!isConfigured()) {
    return MOCK_BOOKS.find(b => b.id === id) ?? null
  }
  const sb = await getSupabase()
  const { data } = await sb.from('books').select('*').eq('id', id).single()
  return data as Book | null
}

// ── Reviews ────────────────────────────────────────────────

export async function getApprovedReviewsForBook(bookId: string): Promise<Review[]> {
  if (!isConfigured()) {
    return MOCK_REVIEWS.filter(r => r.book_id === bookId && r.approved)
  }
  const sb = await getSupabase()
  const { data } = await sb.from('reviews').select('*').eq('book_id', bookId).eq('approved', true).order('created_at', { ascending: false })
  return (data as Review[]) ?? []
}

export async function getAllApprovedReviews(): Promise<(Review & { books?: { id: string; title: string } | null })[]> {
  if (!isConfigured()) {
    return MOCK_REVIEWS.filter(r => r.approved)
  }
  const sb = await getSupabase()
  const { data } = await sb.from('reviews').select('*, books(id, title)').eq('approved', true).order('created_at', { ascending: false })
  return (data as any[]) ?? []
}

// ── Blog ───────────────────────────────────────────────────

export async function getLatestBlogPosts(limit = 3): Promise<BlogPost[]> {
  if (!isConfigured()) {
    return MOCK_BLOG_POSTS.filter(p => p.published).slice(0, limit)
  }
  const sb = await getSupabase()
  const { data } = await sb.from('blog_posts').select('*').eq('published', true).order('created_at', { ascending: false }).limit(limit)
  return (data as BlogPost[]) ?? []
}

export async function getAllPublishedPosts(): Promise<BlogPost[]> {
  if (!isConfigured()) {
    return MOCK_BLOG_POSTS.filter(p => p.published)
  }
  const sb = await getSupabase()
  const { data } = await sb.from('blog_posts').select('*').eq('published', true).order('created_at', { ascending: false })
  return (data as BlogPost[]) ?? []
}

// ── Orders ─────────────────────────────────────────────────

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  if (!isConfigured()) return []
  const sb = await getSupabase()
  const { data } = await sb
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return (data as Order[]) ?? []
}

// ── Other Products ─────────────────────────────────────────

export async function getOtherProducts(): Promise<OtherProduct[]> {
  if (!isConfigured()) return []
  const sb = await getSupabase()
  const { data } = await sb
    .from('other_products')
    .select('*')
    .eq('in_stock', true)
    .order('created_at', { ascending: false })
  return (data as OtherProduct[]) ?? []
}

// ── Hero Slides ────────────────────────────────────────────

export async function getHeroSlides(): Promise<HeroSlide[]> {
  if (!isConfigured()) return []
  const { createServiceClient } = await import('./supabase/server')
  const sb = createServiceClient()
  const { data } = await sb
    .from('hero_slides')
    .select('*')
    .eq('is_active', true)
    .order('position', { ascending: true })
  return (data as HeroSlide[]) ?? []
}

// ── Book Requests ──────────────────────────────────────────

export async function getBookRequests(): Promise<BookRequestRecord[]> {
  if (!isConfigured()) return []
  const { createServiceClient } = await import('./supabase/server')
  const sb = createServiceClient()
  const { data } = await sb
    .from('book_requests')
    .select('*')
    .order('created_at', { ascending: false })
  return (data as BookRequestRecord[]) ?? []
}

// ── Blog ───────────────────────────────────────────────────

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isConfigured()) {
    return MOCK_BLOG_POSTS.find(p => p.slug === slug && p.published) ?? null
  }
  const sb = await getSupabase()
  const { data } = await sb.from('blog_posts').select('*').eq('slug', slug).eq('published', true).single()
  return data as BlogPost | null
}
