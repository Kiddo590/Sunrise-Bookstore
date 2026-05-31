'use client'

import { waHelpLink } from '@/lib/whatsapp'

export default function FloatingWhatsApp() {
  return (
    <a
      href={waHelpLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-20 right-4 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95"
      style={{ backgroundColor: '#25D366' }}
    >
      <svg viewBox="0 0 32 32" fill="white" width="30" height="30" aria-hidden="true">
        <path d="M16 2C8.28 2 2 8.28 2 16c0 2.46.67 4.82 1.84 6.86L2 30l7.35-1.82A13.93 13.93 0 0 0 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.5a11.44 11.44 0 0 1-5.82-1.59l-.42-.25-4.36 1.08 1.1-4.25-.27-.44A11.5 11.5 0 1 1 16 27.5zm6.32-8.6c-.35-.17-2.05-1.01-2.37-1.13-.32-.11-.55-.17-.78.18s-.9 1.13-1.1 1.36c-.2.23-.4.26-.74.09a9.34 9.34 0 0 1-2.74-1.69 10.3 10.3 0 0 1-1.9-2.36c-.2-.34-.02-.53.15-.7.15-.15.35-.4.52-.6.17-.2.23-.34.35-.57.11-.23.06-.43-.03-.6-.09-.17-.78-1.88-1.07-2.57-.28-.67-.57-.58-.78-.59l-.67-.01c-.23 0-.6.09-.91.43-.32.34-1.2 1.17-1.2 2.86s1.23 3.32 1.4 3.55c.17.23 2.42 3.7 5.86 5.19a19.7 19.7 0 0 0 1.96.72c.82.26 1.57.22 2.16.14.66-.1 2.05-.84 2.34-1.65.29-.81.29-1.5.2-1.65-.08-.15-.31-.23-.66-.4z" />
      </svg>
    </a>
  )
}
