/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-quicksand)", "Inter Fallback", "ui-sans-serif", "system-ui", "sans-serif"],
        thin: ["var(--font-raleway)", "Raleway Fallback", "ui-sans-serif", "system-ui", "sans-serif"],
        cursive: ["var(--font-permanent-marker)", "ui-serif", "serif"],
        elegant: ["var(--font-dancing-script)", "ui-serif", "serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: {
          DEFAULT: "#0e5f59",
          foreground: "hsl(var(--primary-foreground))",
          50: "#e6f0ef",
          100: "#b3d7d4",
          200: "#8cc2bd",
          300: "#59a9a1",
          400: "#33978e",
          500: "#0e5f59",
          600: "#0c5651",
          700: "#0a433f",
          800: "#083431",
          900: "#062826",
          950: "#031514",
        },
        "primary-dark": {
          DEFAULT: "#14a89d",
          50: "#e7f7f6",
          100: "#b5e8e5",
          200: "#8fdcd7",
          300: "#5ccdc6",
          400: "#39c3ba",
          500: "#14a89d",
          600: "#12998f",
          700: "#0e7770",
          800: "#0b5c57",
          900: "#094743",
          950: "#042422",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
      },
      backgroundColor: {
        light: "#FAFAFA", // Updated to ensure consistency
        card: "#FFFFFF", // Pure white for cards in light mode
        "slate-dark": {
          DEFAULT: "#0f172a",
          lighter: "#1e293b",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "theme-fade": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "theme-fade": "theme-fade 0.5s ease-out",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
        "card-hover": "0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.05)",
        "slate-dark": "0 4px 6px rgba(0,0,0,0.2)",
      },
      textColor: {
        // Explicit dark mode text colors
        dark: {
          primary: "#f1f5f9", // slate-100
          secondary: "#cbd5e1", // slate-300
          muted: "#94a3b8", // slate-400
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}
