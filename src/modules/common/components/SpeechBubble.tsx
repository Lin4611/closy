import { cn } from "@/lib/utils"

type SpeechBubbleProps = {
    children: React.ReactNode
    className?: string
}

const SpeechBubble = ({ children, className }: SpeechBubbleProps) => {
    return (
        <div className={cn('inline-flex flex-col items-center', className)}>
            <div className="rounded-[12px] bg-primary-800 px-4 py-3 font-label-xl text-white shadow-md">
                {children}
            </div>
            <div className="-mt-px h-0 w-0 border-l-10 border-r-10 border-t-12 border-l-transparent border-r-transparent border-t-primary-800" />
        </div>
    )
}

export default SpeechBubble