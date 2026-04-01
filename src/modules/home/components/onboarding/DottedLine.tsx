type DottedLineProps = {
  d: string
  width: number
  height: number
  color?: string
  rotate?: number
}
export const DottedLine = ({ d, width, height, color = 'white', rotate = 0 }: DottedLineProps) => (
  <svg width={width} height={height} fill="none" style={{ transform: `rotate(${rotate}deg)` }}>
    <path d={d} stroke={color} strokeWidth="3" strokeDasharray="1 9" strokeLinecap="round" />
  </svg>
)
