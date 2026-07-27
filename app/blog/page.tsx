import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllPublishedPosts } from '@/lib/db'
import type { BlogPost } from '@/types'

export const metadata: Metadata = {
  title: 'The Reading List — Flemela Bookstore',
  description: 'Reviews, recommendations and bookish thoughts from Flemela Bookstore in Nairobi.',
}

export default async function BlogPage() {
  const posts = await getAllPublishedPosts()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display font-bold text-ink text-4xl mb-2">The Reading List</h1>
      <p className="text-muted text-lg mb-10">Reviews, recommendations and bookish thoughts.</p>

      {posts.length === 0 ? (
        <p className="text-muted">No posts yet — check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <div className="rounded-2xl bg-paper2 border border-line overflow-hidden hover:shadow-md transition-shadow">
                {post.cover_url ? (
                  <div className="relative h-52">
                    <Image
                      src={post.cover_url}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                ) : (
                  <div
                    className="h-52"
                    style={{ background: 'linear-gradient(135deg, #c05c20 0%, #9e4616 100%)' }}
                  />
                )}
                <div className="p-5">
                  <p className="text-muted text-xs mb-2">
                    {new Date(post.created_at).toLocaleDateString('en-KE', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <h2 className="font-display font-bold text-ink text-lg leading-tight mb-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-muted text-sm line-clamp-3">{post.excerpt}</p>
                  )}
                  <p className="text-rust text-sm font-semibold mt-3 group-hover:underline">Read →</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
