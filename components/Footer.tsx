import Link from 'next/link'
import Image from 'next/image'
import { waHelpLink } from '@/lib/whatsapp'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#013909', color: 'white' }}>
      {/* Main footer columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="mb-4">
            <div className="bg-white rounded-lg px-3 py-2 inline-block mb-2">
              <Image
                src="/logo.png"
                alt="The Flemela Bookstore"
                width={140}
                height={140}
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-xs" style={{ color: '#E9A218' }}>Nairobi, Kenya</p>
          </div>
          <p className="text-white/50 text-sm leading-relaxed mb-4">
            {process.env.NEXT_PUBLIC_STORE_TAGLINE ?? 'Good books. Great prices. Delivered across Nairobi.'}
          </p>
          <div className="flex flex-col gap-2">
            <a
              href={waHelpLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded transition-opacity hover:opacity-90 w-fit"
              style={{ backgroundColor: '#25D366', color: 'white' }}
            >
              💬 WhatsApp: 0143304460
            </a>
            <a
              href={`https://instagram.com/${process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE ?? 'flemelabookstore'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded transition-opacity hover:opacity-90 w-fit"
              style={{ background: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', color: 'white' }}
            >
              📸 IG: @{process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE ?? 'flemelabookstore'}
            </a>
          </div>
        </div>

        {/* Navigate */}
        <div>
          <p className="font-bold text-white text-sm mb-4 uppercase tracking-wider">Navigate</p>
          <ul className="space-y-2.5">
            {[['/', 'Home'], ['/shop', 'Shop'], ['/blog', 'Blog'], ['/reviews', 'Reviews'], ['/request', 'Request a Book']].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-white/50 text-sm hover:text-white transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <p className="font-bold text-white text-sm mb-4 uppercase tracking-wider">Help</p>
          <ul className="space-y-2.5">
            {[
              ['How to Order', waHelpLink('How do I place an order?')],
              ['Track my Order', waHelpLink('I would like to track my order.')],
              ['Return Policy', waHelpLink('What is your return policy?')],
              ['Contact Us', waHelpLink()],
            ].map(([label, href]) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-white/50 text-sm hover:text-white transition-colors">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="font-bold text-white text-sm mb-4 uppercase tracking-wider">Contact</p>
          <p className="text-white/50 text-sm mb-2">📍 Nairobi, Kenya</p>
          <p className="text-white/50 text-sm mb-1">📱 0143304460</p>
          <p className="text-white/50 text-sm mb-3">
            Cash on delivery across Nairobi & Kiambu.
          </p>
          <div
            className="rounded p-3 text-center"
            style={{ backgroundColor: 'rgba(233,162,24,0.12)', border: '1px solid rgba(233,162,24,0.25)' }}
          >
            <p className="text-xs font-bold mb-0.5" style={{ color: '#E9A218' }}>★★★★★</p>
            <p className="text-white/60 text-xs">Trusted by 500+ Nairobi readers</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-white/30 text-xs">
          <p>© 2026 The Flemela Bookstore. All rights reserved.</p>
          <p>Built with ♥ in Nairobi</p>
        </div>
      </div>
    </footer>
  )
}
