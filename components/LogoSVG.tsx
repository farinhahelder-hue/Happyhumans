'use client'

interface LogoSVGProps {
  size?: number
  className?: string
  showGradient?: boolean
}

export default function LogoSVG({ size = 44, className = '', showGradient = true }: LogoSVGProps) {
  const viewBox = 44
  const gradientId = `logoGradient-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox={`0 0 ${viewBox} ${viewBox}`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {showGradient && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2d5f54"/>
            <stop offset="50%" stopColor="#2f6b61"/>
            <stop offset="100%" stopColor="#3d7a72"/>
          </linearGradient>
        </defs>
      )}
      <circle 
        cx={viewBox / 2} 
        cy={viewBox / 2} 
        r={viewBox / 2 - 2} 
        fill={showGradient ? `url(#${gradientId})` : '#2d5f54'}
      />
      
      {/* Calendar icon */}
      <g stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <rect x="11" y="13" width="22" height="20" rx="3"/>
        <line x1="11" y1="19" x2="33" y2="19"/>
        <line x1="16" y1="9" x2="16" y2="15"/>
        <line x1="28" y1="9" x2="28" y2="15"/>
        {/* Checkmark */}
        <path d="M17 26L20 29L27 22" strokeWidth="2"/>
      </g>
    </svg>
  )
}
