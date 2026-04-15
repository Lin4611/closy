import ReactDOM from 'react-dom'
import { toast, Toaster as Sonner, type ToasterProps } from 'sonner'

import { cn } from '@/lib/utils'
import { Overlay } from '@/modules/common/components/Overlay'

const toneStyles = {
  success: 'bg-success-100 text-success-300',
  error: 'bg-danger-100 text-danger-300',
  info: 'bg-white text-neutral-500',
} as const

const ToastPortal = ({
  message,
  tone,
  toastId,
}: {
  message: string
  tone: keyof typeof toneStyles
  toastId: string | number
}) => {
  if (typeof document === 'undefined') return null
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={() => toast.dismiss(toastId)}
    >
      <Overlay />
      <div
        className={cn(
          'font-label-md relative z-10 flex max-w-70 min-w-45 items-center justify-center rounded-[12px] px-6 py-4',
          toneStyles[tone],
        )}
      >
        <p className="text-center wrap-break-word">{message}</p>
      </div>
    </div>,
    document.body,
  )
}

export const showToast = {
  success: (message: string, duration: number = 2000) =>
    toast.custom((t) => <ToastPortal message={message} toastId={t} tone="success" />, {
      duration,
    }),
  error: (message: string, duration: number = 2000) =>
    toast.custom((t) => <ToastPortal message={message} toastId={t} tone="error" />, {
      duration,
    }),
  info: (message: string, duration: number = 2000) =>
    toast.custom((t) => <ToastPortal message={message} toastId={t} tone="info" />, {
      duration,
    }),
}

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      duration={2000}
      toastOptions={{ unstyled: true }}
      {...props}
    />
  )
}

export { Toaster }
