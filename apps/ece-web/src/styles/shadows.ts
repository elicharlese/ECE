/**
 * ECE Shadow Design System
 * Consistent shadow utilities for Beach Monokai theme
 * Patch 6: UI/UX Shadow Improvements
 */

export const shadows = {
  // Beach Monokai Shadow Presets
  glass: {
    sm: 'drop-shadow-sm backdrop-blur-sm',
    md: 'drop-shadow-md backdrop-blur-md',
    lg: 'drop-shadow-lg backdrop-blur-lg',
    xl: 'drop-shadow-xl backdrop-blur-xl'
  },
  
  // Colored shadows based on ECE theme
  colored: {
    primary: 'drop-shadow-[0_4px_12px_rgba(249,38,114,0.3)]', // #F92672
    secondary: 'drop-shadow-[0_4px_12px_rgba(102,217,239,0.3)]', // #66D9EF
    accent: 'drop-shadow-[0_4px_12px_rgba(166,226,46,0.3)]', // #A6E22E
    warning: 'drop-shadow-[0_4px_12px_rgba(230,219,116,0.3)]', // #E6DB74
    success: 'drop-shadow-[0_4px_12px_rgba(166,226,46,0.3)]' // #A6E22E
  },
  
  // Glow effects for special elements
  glow: {
    sm: 'drop-shadow-[0_0_4px_rgba(102,217,239,0.4)] drop-shadow-[0_0_8px_rgba(102,217,239,0.2)]',
    md: 'drop-shadow-[0_0_8px_rgba(102,217,239,0.4)] drop-shadow-[0_0_16px_rgba(102,217,239,0.2)]',
    lg: 'drop-shadow-[0_0_12px_rgba(102,217,239,0.4)] drop-shadow-[0_0_24px_rgba(102,217,239,0.2)]',
    xl: 'drop-shadow-[0_0_16px_rgba(102,217,239,0.4)] drop-shadow-[0_0_32px_rgba(102,217,239,0.2)]'
  },
  
  // 3D depth shadows
  depth: {
    '1': 'drop-shadow-[0_1px_3px_rgba(39,40,34,0.5)]',
    '2': 'drop-shadow-[0_2px_6px_rgba(39,40,34,0.4)]',
    '3': 'drop-shadow-[0_4px_12px_rgba(39,40,34,0.3)]',
    '4': 'drop-shadow-[0_8px_24px_rgba(39,40,34,0.2)]',
    '5': 'drop-shadow-[0_16px_48px_rgba(39,40,34,0.15)]'
  },
  
  // Interactive states
  interactive: {
    idle: 'drop-shadow-[0_2px_8px_rgba(39,40,34,0.3)]',
    hover: 'drop-shadow-[0_4px_16px_rgba(102,217,239,0.3)] drop-shadow-[0_0_12px_rgba(102,217,239,0.2)]',
    active: 'drop-shadow-[0_1px_4px_rgba(39,40,34,0.4)]',
    focus: 'drop-shadow-[0_0_0_2px_rgba(249,38,114,0.5)] drop-shadow-[0_4px_12px_rgba(39,40,34,0.3)]'
  }
}

export const shadowClasses = {
  // Component-specific shadow classes
  button: {
    primary: `${shadows.colored.primary} hover:${shadows.interactive.hover} active:${shadows.interactive.active}`,
    secondary: `${shadows.colored.secondary} hover:${shadows.interactive.hover} active:${shadows.interactive.active}`,
    ghost: `transparent hover:${shadows.depth['2']} active:${shadows.interactive.active}`,
    accent: `${shadows.colored.accent} hover:${shadows.interactive.hover} active:${shadows.interactive.active}`
  },
  
  card: {
    default: `${shadows.glass.md} ${shadows.depth['2']}`,
    hover: `${shadows.glass.lg} ${shadows.depth['3']} ${shadows.glow.sm}`,
    interactive: `${shadows.glass.md} ${shadows.depth['2']} hover:${shadows.glass.lg} hover:${shadows.depth['3']}`,
    floating: `${shadows.glass.xl} ${shadows.depth['4']} ${shadows.glow.md}`
  },
  
  modal: {
    backdrop: 'backdrop-blur-md',
    content: `${shadows.glass.xl} ${shadows.depth['5']} ${shadows.glow.lg}`
  },
  
  navigation: {
    bar: `${shadows.glass.lg} ${shadows.depth['3']}`,
    item: `hover:${shadows.depth['2']} active:${shadows.interactive.active}`
  },
  
  input: {
    default: `${shadows.depth['1']} focus:${shadows.interactive.focus}`,
    error: `${shadows.depth['1']} drop-shadow-[0_0_0_2px_rgba(253,92,99,0.5)]`, // #FD5C63
    success: `${shadows.depth['1']} drop-shadow-[0_0_0_2px_rgba(166,226,46,0.5)]` // #A6E22E
  },
  
  nft: {
    common: `${shadows.colored.accent} ${shadows.depth['2']}`,
    rare: `${shadows.colored.secondary} ${shadows.depth['3']} ${shadows.glow.sm}`,
    epic: `${shadows.colored.primary} ${shadows.depth['4']} ${shadows.glow.md}`,
    legendary: `${shadows.colored.warning} ${shadows.depth['5']} ${shadows.glow.lg} animate-pulse`
  }
}

// CSS-in-JS shadow utilities
export const shadowStyles = {
  glass: {
    small: {
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
      backdropFilter: 'blur(4px)'
    },
    medium: {
      filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
      backdropFilter: 'blur(8px)'
    },
    large: {
      filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1))',
      backdropFilter: 'blur(16px)'
    }
  },
  
  colored: {
    primary: {
      filter: 'drop-shadow(0 4px 12px rgba(249, 38, 114, 0.3))'
    },
    secondary: {
      filter: 'drop-shadow(0 4px 12px rgba(102, 217, 239, 0.3))'
    },
    accent: {
      filter: 'drop-shadow(0 4px 12px rgba(166, 226, 46, 0.3))'
    }
  },
  
  glow: {
    soft: {
      filter: 'drop-shadow(0 0 8px rgba(102, 217, 239, 0.4)) drop-shadow(0 0 16px rgba(102, 217, 239, 0.2))'
    },
    intense: {
      filter: 'drop-shadow(0 0 16px rgba(102, 217, 239, 0.4)) drop-shadow(0 0 32px rgba(102, 217, 239, 0.2))'
    }
  }
}

// Utility function to combine shadow classes
export function combineShadows(...shadowClasses: string[]): string {
  return shadowClasses.filter(Boolean).join(' ')
}

// Responsive shadow utilities
export const responsiveShadows = {
  sm: 'drop-shadow-sm md:drop-shadow-md lg:drop-shadow-lg',
  md: 'drop-shadow-md md:drop-shadow-lg lg:drop-shadow-xl',
  lg: 'drop-shadow-lg md:drop-shadow-xl lg:drop-shadow-2xl'
}

// Animation-ready shadow variants
export const animatedShadows = {
  hover: 'transition-all duration-300 ease-out',
  focus: 'transition-shadow duration-200 ease-in-out',
  bounce: 'transition-all duration-500 ease-in-out',
  pulse: 'animate-pulse'
}
