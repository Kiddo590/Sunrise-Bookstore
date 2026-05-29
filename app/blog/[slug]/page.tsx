import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getBlogPostBySlug } from '@/lib/db'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return { title: 'Post not found — Sunrise Bookstore' }
  return {
    title: `${post.title} — Sunrise Bookstore`,
    description: post.excerpt ?? undefined,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) notFound()

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/blog" className="text-muted text-sm hover:text-ink transition-colors mb-6 inline-block">
        ← Back to blog
      </Link>

      {post.cover_url && (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8">
          <Image
            src={post.cover_url}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      <p className="text-muted text-sm mb-3">
        {new Date(post.created_at).toLocaleDateString('en-KE', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>
      <h1 className="font-display font-bold text-ink text-4xl leading-tight mb-6">{post.title}</h1>

      {post.body && (
        <div className="whitespace-pre-wrap text-ink leading-relaxed text-base">
          {post.body}
        </div>
      )}
    </article>
  )
}
