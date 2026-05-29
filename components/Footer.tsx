import Link from 'next/link'
import { waHelpLink } from '@/lib/whatsapp'

export default function Footer() {
  return (
    <footer className="relative mt-20">
      {/* Top gradient border */}
      <div
        className="h-px w-full"
        style={{ background: 'linear-gradient(to right, transparent, #c05c20 30%, #c05c20 70%, transparent)' }}
      />

      <div
        className="relative bg-ink text-paper py-14 overflow-hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ccircle cx='30' cy='30' r='1' fill='rgba(255,255,255,0.03)'/%3E%3C/svg%3E")`,
        }}
      >
        {/* Faint diagonal stripe overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 20px, rgba(255,255,255,0.015) 20px, rgba(255,255,255,0.015) 40px)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          {/* Social proof bar */}
          <div className="text-center mb-10 pb-8 border-b border-paper/10">
            <p className="text-amber-400 font-semibold text-sm tracking-wide">
              ★★★★★ Trusted by 500+ readers across Nairobi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-rust flex items-center justify-center shrink-0"
                  style={{ boxShadow: '0 4px 12px rgba(192,92,32,0.4)' }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                    <rect x="2" y="3" width="8" height="16" rx="1.5" fill="white"/>
                    <rect x="11" y="5" width="6" height="14" rx="1.5" fill="rgba(255,255,255,0.7)"/>
                    <rect x="18" y="4" width="4" height="15" rx="1" fill="rgba(255,255,255,0.4)"/>
                  </svg>
                </div>
                <div>
                  <p className="font-display font-bold text-paper text-lg leading-none">Sunrise Bookstore</p>
                  <p className="text-paper/40 text-[11px] mt-0.5">Bookshop · Nairobi, Kenya</p>
                </div>
              </div>
              <p className="text-paper/60 text-sm leading-relaxed">
                {process.env.NEXT_PUBLIC_STORE_TAGLINE ?? 'Good books. Great prices. Delivered across Nairobi.'}
              </p>
            </div>

            {/* Nav */}
            <div>
              <p className="font-semibold text-paper mb-4 text-xs uppercase tracking-[0.15em]">Navigate</p>
              <ul className="space-y-2.5">
                {[
                  ['/', 'Home'],
                  ['/shop', 'Shop'],
                  ['/blog', 'Blog'],
                  ['/reviews', 'Reviews'],
                  ['/request', 'Request a Book'],
                ].map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="text-paper/60 text-sm hover:text-paper transition-colors hover:translate-x-0.5 inline-block">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="font-semibold text-paper mb-4 text-xs uppercase tracking-[0.15em]">Get in touch</p>
              <p className="text-paper/60 text-sm mb-3">📍 Nairobi, Kenya</p>
              <a
                href={waHelpLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#25D366', color: 'white' }}
              >
                💬 Chat on WhatsApp
              </a>
              <p className="text-paper/40 text-xs mt-3 leading-relaxed">
                Orders confirmed via WhatsApp. Cash on delivery across Nairobi.
              </p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-paper/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-paper/30 text-xs">
            <p>© 2026 Sunrise Bookstore. All rights reserved.</p>
            <p>Built with ♥ in Nairobi</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
