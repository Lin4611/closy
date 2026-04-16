type RecognitionLoadingProps = {
  title?: string
  description?: string
}

export const RecognitionLoading = ({
  title = '正在辨識中',
  description = '辨識中...',
}: RecognitionLoadingProps) => {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 pt-10 text-center">
      <div className="mb-5 flex items-center gap-1.75">
        <span className="h-1.75 w-1.75 animate-bounce rounded-full bg-primary-900 [animation-delay:-0.3s]" />
        <span className="h-1.75 w-1.75 animate-bounce rounded-full bg-primary-900 [animation-delay:-0.15s]" />
        <span className="h-1.75 w-1.75 animate-bounce rounded-full bg-primary-900" />
      </div>
      <div>
        <p className="font-label-md text-neutral-900">{title}</p>
        <p className="mt-1 font-paragraph-xs text-neutral-500">{description}</p>
      </div>
    </section>
  )
}