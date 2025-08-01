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
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        'soft-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'soft-color': '0 4px 6px -1px rgba(249, 38, 114, 0.1), 0 2px 4px -1px rgba(249, 38, 114, 0.06)',
        'soft-success': '0 4px 6px -1px rgba(166, 226, 46, 0.1), 0 2px 4px -1px rgba(166, 226, 46, 0.06)',
        'glow-primary': '0 0 20px rgba(249, 38, 114, 0.4)',
        'glow-secondary': '0 0 20px rgba(102, 217, 239, 0.4)',
        'glow-success': '0 0 20px rgba(166, 226, 46, 0.4)',
        'card-ece': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'card-ece-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        
        // Enhanced ECE Shadow System (Batch 2)
        'soft-sm': '0 1px 2px rgba(39, 40, 34, 0.1)',
        'soft-md': '0 4px 6px rgba(39, 40, 34, 0.1), 0 2px 4px rgba(39, 40, 34, 0.06)',
        'soft-2xl': '0 25px 50px rgba(39, 40, 34, 0.15)',
        
        'primary-glow': '0 0 20px rgba(249, 38, 114, 0.4)',
        'secondary-glow': '0 0 20px rgba(166, 226, 46, 0.4)',
        'info-glow': '0 0 20px rgba(102, 217, 239, 0.4)',
        'ocean-glow': '0 0 20px rgba(0, 139, 139, 0.4)',
        
        'glass-light': '0 8px 32px rgba(255, 255, 255, 0.1)',
        'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.1)',
        
        'rarity-common': '0 4px 12px rgba(166, 226, 46, 0.3)',
        'rarity-rare': '0 4px 12px rgba(102, 217, 239, 0.3)',
        'rarity-epic': '0 4px 12px rgba(153, 50, 204, 0.3)',
        'rarity-legendary': '0 4px 20px rgba(255, 215, 0, 0.4), 0 0 40px rgba(255, 165, 0, 0.2)',
        
        'gradient-sunset': '0 8px 32px rgba(249, 38, 114, 0.2), 0 4px 16px rgba(253, 92, 99, 0.1)',
        'gradient-tide': '0 8px 32px rgba(102, 217, 239, 0.2), 0 4px 16px rgba(62, 186, 124, 0.1)',
        'gradient-wave': '0 12px 40px rgba(0, 139, 139, 0.25), 0 6px 20px rgba(32, 178, 170, 0.15)',
        
        'floating': '0 10px 30px rgba(39, 40, 34, 0.2)',
        'elevated': '0 15px 35px rgba(39, 40, 34, 0.25)',
        'lifted': '0 20px 40px rgba(39, 40, 34, 0.3)'
      },
      dropShadow: {
        'icon': ['0 1px 2px rgba(0, 0, 0, 0.1)', '0 1px 1px rgba(0, 0, 0, 0.06)'],
        'icon-strong': ['0 4px 6px rgba(0, 0, 0, 0.1)', '0 2px 4px rgba(0, 0, 0, 0.06)'],
      },
      textShadow: {
        'soft': '0 1px 2px rgba(0, 0, 0, 0.1)',
        'strong': '0 2px 4px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [
    function({ addUtilities }: any) {
      const newUtilities = {
        '.text-shadow-soft': {
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-strong': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}

export default config
