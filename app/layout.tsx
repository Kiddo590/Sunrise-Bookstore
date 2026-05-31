import type { Metadata } from 'next'
import { Fraunces, Hanken_Grotesk } from 'next/font/google'
import { Toaster } from 'sonner'
import { CartProvider } from '@/components/CartProvider'
import BannerStrip from '@/components/BannerStrip'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BottomNav from '@/components/BottomNav'
import './globals.css'

const displayFont = Fraunces({
  subsets: ['latin'],
  variable: '--font-display-var',
  display: 'swap',
})

const bodyFont = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-body-var',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'The Sunrise BookStore — Good books. Great prices. Delivered across Nairobi.',
  description:
    'Shop for hardcopy and ebook titles at The Sunrise BookStore in Nairobi, Kenya. Order via WhatsApp with cash on delivery.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="min-h-screen bg-paper2 text-ink font-body">
        <CartProvider>
          <BannerStrip />
          <Navbar />
          {/* pb-14 clears the fixed bottom nav on all screen sizes */}
          <main className="pb-14">{children}</main>
          <Footer />
          <BottomNav />
          <Toaster richColors position="top-center" />
        </CartProvider>
      </body>
    </html>
  )
}
