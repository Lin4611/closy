import { cn } from '@/lib/utils'
import { Overlay } from '@/modules/common/components/Overlay'

type ResultDialogProps = {
    open: boolean
    message: string
    confirmText: string
    onConfirm: () => void
    onClose: () => void
    ariaLabel: string
    widthClassName?: string
    contentClassName?: string
    buttonClassName?: string
    closeOnOverlayClick?: boolean
}

export const ResultDialog = ({
    open,
    message,
    confirmText,
    onConfirm,
    onClose,
    ariaLabel,
    widthClassName = 'w-69',
    contentClassName = 'px-5 py-7',
    buttonClassName = 'h-10 rounded-[10px] border border-neutral-400 bg-white text-neutral-700',
    closeOnOverlayClick = true,
}: ResultDialogProps) => {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 mx-auto w-full max-w-93.75">
            <button
                type="button"
                className="absolute inset-0 w-full"
                onClick={closeOnOverlayClick ? onClose : undefined}
                aria-label={ariaLabel}
            >
                <Overlay />
            </button>

            <section
                className={cn(
                    'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[16px] bg-white text-center shadow-[0_8px_24px_rgba(15,23,42,0.18)]',
                    widthClassName,
                    contentClassName,
                )}
            >
                <p className="mb-4 font-label-sm text-neutral-700">{message}</p>
                <button
                    type="button"
                    onClick={onConfirm}
                    className={cn('w-full font-label-sm', buttonClassName)}
                >
                    {confirmText}
                </button>
            </section>
        </div>
    )
}