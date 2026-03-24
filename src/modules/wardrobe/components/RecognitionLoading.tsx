type RecognitionLoadingProps = {
  title?: string
  description?: string
}

export const RecognitionLoading = ({
  title = '正在辨識中',
  description = '請稍候...',
}: RecognitionLoadingProps) => {
  return (
    <section className="flex min-h-[calc(100vh-120px)] flex-col items-center justify-center gap-5 px-6 text-center">
      <div className="flex gap-2">
        <span className="h-3 w-3 animate-bounce rounded-full bg-primary-900 [animation-delay:-0.3s]" />
        <span className="h-3 w-3 animate-bounce rounded-full bg-primary-900 [animation-delay:-0.15s]" />
        <span className="h-3 w-3 animate-bounce rounded-full bg-primary-900" />
      </div>
      <div>
        <p className="font-label-xl text-neutral-900">{title}</p>
        <p className="font-paragraph-sm mt-1 text-neutral-500">{description}</p>
      </div>
    </section>
  )
}
