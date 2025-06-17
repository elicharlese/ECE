# ECE Trading Platform - Theme System

## Overview
The ECE Trading Platform now uses a comprehensive light/dark theme system with your requested colors:

- **Light Background**: `#FAFAFA`
- **Dark Background**: Slate grey (`#334155`)
- **Primary Accent**: `#0e5f59` (teal)

## Theme Implementation

### 1. CSS Custom Properties
The theme system uses CSS custom properties defined in `app/globals.css`:

```css
:root {
  /* Light theme colors */
  --background: #FAFAFA;
  --foreground: #1e293b;
  --primary: #0e5f59;
  --accent: #0e5f59;
  /* ... other properties */
}

[data-theme="dark"] {
  /* Dark theme - slate grey backgrounds */
  --background: #334155;
  --foreground: #f1f5f9;
  --primary: #0e5f59;
  --accent: #0e5f59;
  /* ... other properties */
}
```

### 2. Theme Context
The theme is managed through React Context (`src/lib/theme-context.tsx`):

```tsx
const { theme, toggleTheme, setTheme } = useTheme();
```

### 3. Theme Toggle Component
Use the `ThemeToggle` component anywhere in your app:

```tsx
import { ThemeToggle } from '../src/components/theme-toggle';

// Different variants available
<ThemeToggle />                    // Default icon variant
<ThemeToggle variant="button" />   // Button variant
<ThemeToggle variant="switch" />   // Switch variant
<ThemeToggle size="lg" />         // Different sizes: sm, md, lg
```

## Using Theme Colors

### With CSS Custom Properties (Recommended)
```css
.my-component {
  background-color: var(--background);
  color: var(--foreground);
  border: 1px solid var(--border);
}
```

### With Tailwind Classes
```tsx
<div className="bg-background text-foreground border border-border">
  <button className="bg-accent text-accent-foreground hover:bg-accent/90">
    Click me
  </button>
</div>
```

## Available Theme Colors

### Primary Colors
- `--background` / `bg-background` - Main background
- `--foreground` / `text-foreground` - Main text color
- `--primary` / `bg-primary` - Primary color (same as accent)
- `--accent` / `bg-accent` - Primary accent color (#0e5f59)

### Secondary Colors
- `--secondary` / `bg-secondary` - Secondary backgrounds
- `--card` / `bg-card` - Card backgrounds
- `--muted` / `text-muted` - Muted text colors
- `--border` / `border-border` - Border colors

### Component Colors
- `--input` / `bg-input` - Input backgrounds
- `--popover` / `bg-popover` - Popover backgrounds
- `--destructive` / `bg-destructive` - Error/danger colors

## Theme Values

### Light Theme
- Background: `#FAFAFA` (very light grey)
- Cards: `#ffffff` (white)
- Text: `#1e293b` (dark slate)
- Accent: `#0e5f59` (teal)

### Dark Theme
- Background: `#334155` (slate grey)
- Cards: `#475569` (darker slate)
- Text: `#f1f5f9` (light)
- Accent: `#0e5f59` (teal - consistent)

## Features

1. **Automatic System Detection**: Respects user's OS theme preference
2. **Manual Toggle**: Users can manually switch themes
3. **Persistent**: Theme choice is saved in localStorage
4. **Smooth Transitions**: All theme changes are animated
5. **Consistent Accent**: The teal accent color (#0e5f59) remains consistent across themes

## Migration Guide

To update existing components:

1. **Replace hardcoded colors** with CSS custom properties:
   ```tsx
   // Before
   className="bg-gray-100 text-gray-900"
   
   // After
   className="bg-secondary text-secondary-foreground"
   ```

2. **Add theme context** to components that need theme awareness:
   ```tsx
   import { useTheme } from '../src/lib/theme-context';
   
   const { theme } = useTheme();
   const isDark = theme === 'dark';
   ```

3. **Use the ThemeToggle component** in navigation bars or settings:
   ```tsx
   import { ThemeToggle } from '../src/components/theme-toggle';
   
   <ThemeToggle />
   ```

## Examples

### Card Component
```tsx
<div className="bg-card text-card-foreground border border-border rounded-lg p-4">
  <h2 className="text-foreground font-bold">Card Title</h2>
  <p className="text-muted-foreground">Card description</p>
  <button className="bg-accent text-accent-foreground hover:bg-accent/90 px-4 py-2 rounded">
    Action Button
  </button>
</div>
```

### Form Input
```tsx
<input 
  className="bg-input text-foreground border border-border rounded px-3 py-2 focus:ring-2 focus:ring-accent"
  placeholder="Enter text..."
/>
```

This theme system provides a consistent, accessible, and beautiful experience across all components while maintaining your requested color scheme.
