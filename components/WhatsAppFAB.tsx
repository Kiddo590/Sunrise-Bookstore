import { waHelpLink } from '@/lib/whatsapp'

export default function WhatsAppFAB() {
  return (
    <a
      href={waHelpLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="hidden md:flex fixed bottom-6 right-6 z-50 w-[56px] h-[56px] rounded-full shadow-xl items-center justify-center text-2xl"
      style={{ backgroundColor: '#25D366' }}
      aria-label="Chat on WhatsApp"
    >
      💬
    </a>
  )
}
