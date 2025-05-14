"use client"

interface SimpleCardProps {
  title: string
  color?: string
  className?: string
  width?: number | string
  height?: number | string
}

export function SimpleCard({ title, color = "#0e5f59", className = "", width = 300, height = 200 }: SimpleCardProps) {
  return (
    <div
      className={`rounded-lg overflow-hidden ${className}`}
      style={{
        width: width,
        height: height,
        background: `linear-gradient(135deg, ${color}22, ${color}44)`,
      }}
    >
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="text-center p-6 rounded-lg" style={{ backgroundColor: `${color}22` }}>
          <h3 className="font-medium text-lg" style={{ color: color }}>
            {title}
          </h3>
        </div>
      </div>
    </div>
  )
}
