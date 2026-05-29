import Link from 'next/link'
import { waHelpLink } from '@/lib/whatsapp'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1b1c2b', color: 'white' }}>
      {/* Main footer columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#f68b1e' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect x="1" y="2" width="7" height="16" rx="1.5" fill="white"/>
                <rect x="9.5" y="4" width="5.5" height="13" rx="1.5" fill="rgba(255,255,255,0.8)"/>
                <rect x="16" y="3" width="4" height="14" rx="1" fill="rgba(255,255,255,0.5)"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-white text-base leading-none">Sunrise Bookstore</p>
              <p className="text-xs mt-0.5" style={{ color: '#f68b1e' }}>Nairobi, Kenya</p>
            </div>
          </div>
          <p className="text-white/50 text-sm leading-relaxed mb-4">
            {process.env.NEXT_PUBLIC_STORE_TAGLINE ?? 'Good books. Great prices. Delivered across Nairobi.'}
          </p>
          <a
            href={waHelpLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#25D366', color: 'white' }}
          >
            💬 Chat on WhatsApp
          </a>
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
          <p className="text-white/50 text-sm mb-3">
            Cash on delivery across Nairobi & Kiambu.
          </p>
          <div
            className="rounded p-3 text-center"
            style={{ backgroundColor: 'rgba(246,139,30,0.12)', border: '1px solid rgba(246,139,30,0.25)' }}
          >
            <p className="text-xs font-bold mb-0.5" style={{ color: '#f68b1e' }}>★★★★★</p>
            <p className="text-white/60 text-xs">Trusted by 500+ Nairobi readers</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-white/30 text-xs">
          <p>© 2026 Sunrise Bookstore. All rights reserved.</p>
          <p>Built with ♥ in Nairobi</p>
        </div>
      </div>
    </footer>
  )
}
