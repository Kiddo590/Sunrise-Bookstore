-- ============================================================
-- FLEMELA BOOKSTORE — Run this in the Supabase SQL Editor
-- ============================================================

-- BOOKS
create table books (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  author           text not null,
  description      text,
  category         text,
  price_hard       numeric(10,2),
  price_ebook      numeric(10,2),
  cover_url        text,
  cover_public_id  text,
  is_deal          boolean default false,
  is_featured      boolean default false,
  is_top_seller    boolean default false,
  in_stock         boolean default true,
  created_at       timestamptz default now()
);

-- REVIEWS
create table reviews (
  id          uuid primary key default gen_random_uuid(),
  book_id     uuid references books(id) on delete cascade,
  reviewer    text not null,
  body        text not null,
  rating      smallint check (rating between 1 and 5),
  approved    boolean default false,
  created_at  timestamptz default now()
);

-- BLOG POSTS
create table blog_posts (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text unique not null,
  excerpt     text,
  body        text,
  cover_url   text,
  published   boolean default false,
  created_at  timestamptz default now()
);

-- ORDERS
create table orders (
  id               uuid primary key default gen_random_uuid(),
  customer_name    text not null,
  customer_phone   text not null,
  customer_email   text,
  delivery_address text not null,
  county           text,
  delivery_fee     numeric(10,2) default 0,
  items            jsonb not null,
  total_kes        numeric(10,2) not null,
  payment_method   text default 'cod',
  status           text default 'pending',
  created_at       timestamptz default now(),
  user_id          uuid references auth.users(id) on delete set null
);

-- BOOK REQUESTS
create table book_requests (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  author      text,
  format      text,
  notes       text,
  phone       text,
  created_at  timestamptz default now()
);

-- ROW LEVEL SECURITY
alter table books          enable row level security;
alter table reviews        enable row level security;
alter table blog_posts     enable row level security;
alter table orders         enable row level security;
alter table book_requests  enable row level security;

create policy "Public read books"
  on books for select using (true);

create policy "Public read published posts"
  on blog_posts for select using (published = true);

create policy "Public read approved reviews"
  on reviews for select using (approved = true);

create policy "Public insert orders"
  on orders for insert with check (true);

create policy "Public insert requests"
  on book_requests for insert with check (true);

create policy "Public insert reviews"
  on reviews for insert with check (true);

-- Admin full-access policies (for service role key usage in API routes)
-- The service role bypasses RLS, so no additional policies needed for admin ops.
