/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './ece-web/src/**/*.{js,ts,jsx,tsx,mdx}',
    './shared-ui/src/**/*.{js,ts,jsx,tsx,mdx}',
    './desktop/src/**/*.{js,ts,jsx,tsx,mdx}',
    './web/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Beach Monokai Color Palette
        'monokai': {
          'pink': '#F92672',      // Accent, buttons, highlights
          'green': '#A6E22E',     // Success, floating elements, nav hovers
          'blue': '#66D9EF',      // Info, links, sky gradients
          'yellow': '#E6DB74',    // Secondary background, soft buttons
          'cream': '#F8EFD6',     // Light background, text backgrounds
          'dark': '#272822',      // Main background (dark), primary canvas
          'purple': '#819AFF',    // Primary buttons, input text, hover links
          'emerald': '#3EBA7C',   // Success tones, icons, subtle detail
          'gray': '#75715E',      // Muted text, placeholder content
          'coral': '#FD5C63',     // Alerts, accents, beach vibes
          'orange': '#FD971F',    // Warning tones
        },
        // Semantic color mappings
        primary: '#819AFF',
        secondary: '#E6DB74',
        accent: '#F92672',
        success: '#A6E22E',
        warning: '#FD971F',
        error: '#FD5C63',
        info: '#66D9EF',
      },
      backgroundImage: {
        'gradient-sunset': 'linear-gradient(90deg, #F92672, #FD5C63)',
        'gradient-tide': 'linear-gradient(90deg, #66D9EF, #3EBA7C)',
        'gradient-sand': 'linear-gradient(180deg, #F8EFD6, #819AFF)',
      },
      animation: {
        'wave': 'wave 6s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
