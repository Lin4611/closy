import { Overlay } from '@/modules/common/components/Overlay'

type AlertDialogProps = {
    open: boolean
    title: string
    description: string
    confirmText: string
    cancelText: string
    onConfirm: () => void
    onCancel: () => void
}

export const AlertDialog = ({
    open,
    title,
    description,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
}: AlertDialogProps) => {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 mx-auto w-full max-w-93.75">
            <button
                type="button"
                className="absolute inset-0 w-full"
                onClick={onCancel}
                aria-label="close dialog"
            >
                <Overlay />
            </button>

            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="absolute top-1/2 left-1/2 w-76 -translate-x-1/2 -translate-y-1/2 rounded-[16px] bg-white px-5 pt-5 pb-4 text-center shadow-[0_8px_24px_rgba(15,23,42,0.18)]"
            >
                <h2 id="alert-dialog-title" className="font-label-xl text-neutral-900">
                    {title}
                </h2>
                <p id="alert-dialog-description" className="mt-2 mb-5 font-paragraph-sm text-neutral-600">
                    {description}
                </p>

                <div className="space-y-2">
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="h-11 w-full rounded-[8px] bg-danger-300 font-label-sm text-white"
                    >
                        {confirmText}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="h-11 w-full rounded-[8px] border border-neutral-400 bg-white font-label-sm text-neutral-700"
                    >
                        {cancelText}
                    </button>
                </div>
            </section>
        </div>
    )
}