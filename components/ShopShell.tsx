'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import BottomNav from './BottomNav'

export default function ShopShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname.startsWith('/admin')) return <>{children}</>

  return (
    <>
      <Navbar />
      <main className="pb-14">{children}</main>
      <Footer />
      <BottomNav />
    </>
  )
}
