# Sunrise Bookstore

A warm, editorial online bookshop for Nairobi, Kenya. Built with Next.js 16, Tailwind CSS v4, Supabase, and Cloudinary. Orders placed via WhatsApp — no payment gateway required.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** (CSS-based config via `@theme inline`)
- **Supabase** (Postgres + Auth + Storage)
- **Cloudinary** (cover image uploads)
- **Vercel** (deployment)

## Features

- Public shop with format/category filters and search
- Hardcopy orders via pre-filled WhatsApp messages
- Ebook purchases (instant download)
- Deal of the Day with live countdown
- Blog / reading list
- Customer reviews (moderated)
- Book request form
- Admin dashboard (books, orders, blog, reviews)
- Mock data mode — works fully without Supabase credentials

## Getting Started

```bash
npm install
npm run dev
```

The app runs without any environment variables — mock data is served automatically when Supabase is not configured.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials to connect to a live backend:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_WHATSAPP_NUMBER=2547XXXXXXXX
NEXT_PUBLIC_STORE_TAGLINE=Good books. Great prices. Delivered across Nairobi.
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Database

Run `supabase-schema.sql` in the Supabase SQL Editor to create all tables and RLS policies, then `supabase-seed.sql` to load sample data.

## Deploy

Push to GitHub and connect to [Vercel](https://vercel.com). Add the environment variables in the Vercel dashboard. The free Hobby plan is sufficient.
