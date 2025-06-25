import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        'ocean': {
          'accent': 'var(--ocean-accent)',
          'success': 'var(--ocean-success)',
          'info': 'var(--ocean-info)',
          'secondary': 'var(--ocean-secondary)',
          'light': 'var(--ocean-light)',
          'dark': 'var(--ocean-dark)',
          'primary': 'var(--ocean-primary)',
          'success-tone': 'var(--ocean-success-tone)',
          'muted': 'var(--ocean-muted)',
          'alert': 'var(--ocean-alert)',
        },
        'monokai': {
          'accent': 'var(--monokai-accent)',
          'success': 'var(--monokai-success)',
          'info': 'var(--monokai-info)',
          'warning': 'var(--monokai-warning)',
          'purple': 'var(--monokai-purple)',
        }
      },
      backgroundImage: {
        'gradient-ocean': 'linear-gradient(90deg, #14B8A6, #10B981)',
        'gradient-tide': 'linear-gradient(90deg, #06B6D4, #059669)',
        'gradient-deep-sea': 'linear-gradient(180deg, #F0FDFA, #0F766E)',
        'gradient-monokai': 'linear-gradient(90deg, #F92672, #AE81FF)',
      },
      animation: {
        'wave': 'wave 4s ease-in-out infinite',
        'breathe': 'breathe 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-10px) rotate(1deg)' },
          '50%': { transform: 'translateY(-5px) rotate(0deg)' },
          '75%': { transform: 'translateY(-15px) rotate(-1deg)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1) translateY(0)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05) translateY(-2px)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
      backdropBlur: {
        '4xl': '72px',
      }
    },
  },
  plugins: [],
}

export default config
