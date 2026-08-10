type Props = { size?: number }

export default function Spinner({ size = 48 }: Props) {
  const thickness = Math.max(3, Math.round(size / 12))
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Track ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ border: `${thickness}px solid rgba(246,139,30,0.15)` }}
      />
      {/* Spinning arc */}
      <div
        className="absolute inset-0 rounded-full animate-spin"
        style={{
          border: `${thickness}px solid transparent`,
          borderTopColor: '#074C17',
          borderRightColor: 'rgba(246,139,30,0.4)',
        }}
      />
      {/* Brand letter */}
      <span
        className="font-black select-none"
        style={{ fontSize: size * 0.36, color: '#074C17', lineHeight: 1 }}
      >
        S
      </span>
    </div>
  )
}
