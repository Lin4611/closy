type ToastProps = {
    open: boolean
    message: string
    tone?: 'success' | 'error' | 'default'
}

const toneClassNameMap: Record<NonNullable<ToastProps['tone']>, string> = {
    success: 'bg-success-100 text-success-300',
    error: 'bg-danger-100 text-danger-300',
    default: 'bg-white text-neutral-700',
}

export const Toast = ({ open, message, tone = 'default' }: ToastProps) => {
    if (!open) return null

    return (
        <div
            className={`fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-[12px] px-4 py-3 shadow-[0_8px_18px_rgba(15,23,42,0.12)] ${toneClassNameMap[tone]}`}
        >
            <p className="font-label-sm">{message}</p>
        </div>
    )
}