'use client';

export function Cube3D() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cube-top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#1e40af', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="cube-right" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#1e40af', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#1e3a8a', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="cube-left" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      {/* Cube */}
      <polygon points="50,50 150,50 150,100 50,100" fill="url(#cube-top)" />
      <polygon points="150,50 150,100 100,150 100,100" fill="url(#cube-right)" />
      <polygon points="50,100 100,150 100,100" fill="url(#cube-left)" />
      <polygon points="50,50 100,0 100,50" fill="url(#cube-left)" opacity="0.8" />
    </svg>
  );
}

export function Pyramid3D() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pyr-left" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#6d28d9', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="pyr-right" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#6d28d9', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#4c1d95', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      {/* Pyramid */}
      <polygon points="100,30 30,170 100,140" fill="url(#pyr-left)" />
      <polygon points="100,30 170,170 100,140" fill="url(#pyr-right)" />
      <polygon points="30,170 170,170 100,140" fill="#4c1d95" opacity="0.6" />
    </svg>
  );
}

export function Sphere3D() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sphere-grad">
          <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
          <stop offset="70%" style={{ stopColor: '#0891b2', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#0e7490', stopOpacity: 1 }} />
        </radialGradient>
      </defs>
      {/* Sphere */}
      <circle cx="100" cy="100" r="70" fill="url(#sphere-grad)" />
      {/* Highlight */}
      <ellipse cx="75" cy="75" rx="20" ry="25" fill="white" opacity="0.3" />
      {/* Shadow lines */}
      <path d="M 50 100 Q 100 150 150 100" stroke="rgba(0,0,0,0.2)" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function Torus3D() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="torus-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#be185d', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      {/* Outer ring */}
      <circle cx="100" cy="100" r="60" fill="none" stroke="url(#torus-grad)" strokeWidth="20" opacity="0.8" />
      {/* Inner highlight */}
      <circle cx="100" cy="100" r="50" fill="none" stroke="rgba(236, 72, 153, 0.3)" strokeWidth="10" />
    </svg>
  );
}
