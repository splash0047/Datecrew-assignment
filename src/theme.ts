export const THEME = {
  colors: {
    background: '#F8F7F4', // Warm paper background
    backgroundSecondary: '#F3F2EE',
    card: '#FFFFFF',
    primary: '#5B4AE6',    // Deep Indigo
    primaryLight: '#7C6CF2', // Muted Lavender
    accent: '#C8A95D',     // Warm Gold
    success: '#16A34A',
    warning: '#D97706',
    error: '#DC2626',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
  },
  typography: {
    fontHeading: 'font-heading tracking-tight',
    fontBody: 'font-body',
    fontMono: 'font-mono',
  },
  radius: {
    card: 'rounded-[16px]',
    interactive: 'rounded-[12px]',
    badge: 'rounded-full',
  },
  shadows: {
    sm: 'shadow-sm',
    hover: 'hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 ease-out',
    borderHairline: 'border border-border',
  },
  transitions: {
    default: 'transition-all duration-200 ease-out',
    spring: 'transition-all duration-300 cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  backgroundEffects: {
    radialGlow: 'radial-gradient(circle at top right, rgba(91, 74, 230, 0.05) 0%, transparent 50%)',
    noiseTexture: {
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E")`,
    }
  }
} as const;
