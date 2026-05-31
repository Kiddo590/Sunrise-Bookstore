export type Book = {
  id: string
  title: string
  author: string
  description: string | null
  category: string | null
  price_hard: number | null
  price_ebook: number | null
  cover_url: string | null
  cover_public_id: string | null
  is_deal: boolean
  is_featured: boolean
  in_stock: boolean
  created_at: string
}

export type Review = {
  id: string
  book_id: string
  reviewer: string
  body: string
  rating: number
  approved: boolean
  created_at: string
}

export type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  body: string | null
  cover_url: string | null
  published: boolean
  created_at: string
}

export type Order = {
  id: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  delivery_address: string
  items: CartItem[]
  total_kes: number
  payment_method: string
  status: string
  created_at: string
  user_id?: string | null
}

export type CartItem = {
  uid: string
  bookId: string
  title: string
  format: 'hardcopy' | 'ebook'
  price: number
  coverUrl?: string
}

export type BookRequest = {
  title: string
  author?: string
  format: 'hardcopy' | 'ebook' | 'either'
  phone: string
  notes?: string
}

export type OtherProduct = {
  id: string
  name: string
  description: string | null
  price_kes: number
  cover_url: string | null
  cover_public_id: string | null
  category: string | null
  in_stock: boolean
  created_at: string
}

export type BookRequestRecord = {
  id: string
  title: string
  author: string | null
  format: 'hardcopy' | 'ebook' | 'either'
  phone: string
  notes: string | null
  status: 'pending' | 'sourced' | 'unavailable'
  created_at: string
}
