type SpotlightHole = {
  x: number
  y: number
  width: number
  height: number
  radius?: number
}

type SpotlightMaskProps = {
  holes: SpotlightHole[]
}

export function getTargetRect(targetId?: string, padding = 8) {
  if (!targetId) return null

  const el = document.getElementById(targetId)
  if (!el) return null

  const rect = el.getBoundingClientRect()
  const container = document.querySelector('[data-mobile-layout]')
  const containerRect = container?.getBoundingClientRect() ?? { left: 0, top: 0 }

  return {
    x: rect.left - containerRect.left - padding,
    y: rect.top - containerRect.top - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
  }
}

export function SpotlightMask({ holes }: SpotlightMaskProps) {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full">
      <defs>
        <mask id="spotlight-mask">
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          {holes.map((hole, index) => (
            <rect
              key={index}
              x={hole.x}
              y={hole.y}
              width={hole.width}
              height={hole.height}
              rx={hole.radius ?? 16}
              ry={hole.radius ?? 16}
              fill="black"
            />
          ))}
        </mask>
      </defs>

      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="rgba(0,0,0,0.6)"
        mask="url(#spotlight-mask)"
      />
    </svg>
  )
}
