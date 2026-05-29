import { waHelpLink } from '@/lib/whatsapp'

export default function WhatsAppFAB() {
  return (
    <a
      href={waHelpLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-[58px] h-[58px] rounded-full shadow-xl flex items-center justify-center text-2xl"
      style={{ backgroundColor: '#25D366' }}
      aria-label="Chat on WhatsApp"
    >
      💬
    </a>
  )
}
