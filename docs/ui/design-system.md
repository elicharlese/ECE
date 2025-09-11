# ECE Design System

## Overview

The ECE platform uses a clean, modern design system with white/black primaries and monokai beach accents for visual interest. This system ensures consistency across all platforms (web, mobile, desktop) while maintaining accessibility and usability standards.

## Color Palette

### Primary Colors
- **Light Mode Primary**: White (#FFFFFF) - Used for backgrounds, cards, and primary surfaces
- **Dark Mode Primary**: Black (#000000) - Used for dark mode backgrounds and surfaces

### Accent Colors (Monokai Beach Theme)
- **Accent**: #F92672 (pink/red) - Primary accent for buttons, links, and highlights
- **Green**: #A6E22E - Success states, positive actions
- **Blue**: #66D9EF - Information, links, secondary accents
- **Yellow**: #E6DB74 - Warnings, highlights
- **Orange**: #FD971F - Attention, secondary actions

### Gradients
- **Sunset**: Linear gradient from #FD971F to #F92672
- **Ocean**: Blue gradient from #66D9EF to darker blue
- **Beach**: Warm gradient from #E6DB74 to #FD971F
- **Monokai**: Variations of accent colors for depth

## Usage Guidelines

### Color Ratios
- **70-80%** primary colors (white/black) for foundation and readability
- **20-30%** monokai accents for visual interest and branding
- Maintain balance to avoid overwhelming users

### Accessibility
- All color combinations meet **WCAG 2.1 AA** standards
- High contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Dark mode support with proper color inversions
- Consider color blindness when selecting accent combinations

## Typography

### Font Family
- **Primary**: System fonts (Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)
- **Monospace**: For code (SF Mono, Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace)

### Font Sizes (using Tailwind scale)
- **xs**: 12px (small labels)
- **sm**: 14px (secondary text)
- **base**: 16px (body text)
- **lg**: 18px (large body)
- **xl**: 20px (small headings)
- **2xl**: 24px (headings)
- **3xl**: 30px (large headings)
- **4xl**: 36px (hero text)

### Font Weights
- **Regular**: 400 (body text)
- **Medium**: 500 (emphasis)
- **Semibold**: 600 (subheadings)
- **Bold**: 700 (headings, strong emphasis)

## Spacing

### Scale (4px base unit)
- **1**: 4px (minimal spacing)
- **2**: 8px (component padding)
- **3**: 12px (small gaps)
- **4**: 16px (standard padding)
- **6**: 24px (section spacing)
- **8**: 32px (large gaps)
- **12**: 48px (major sections)
- **16**: 64px (page sections)
- **24**: 96px (hero spacing)
- **32**: 128px (full sections)

### Usage
- Consistent spacing using Tailwind classes (p-4, m-6, etc.)
- 4px base unit for precise alignment
- Larger units for breathing room between sections

## Components

### Buttons
- **Primary**: Solid background with white text, primary color
- **Secondary**: Outlined with accent border, transparent background
- **Ghost**: Minimal styling, accent text with hover effects
- **Disabled**: Reduced opacity, no interactions

### Cards
- **GlassCard**: Translucent with blur effect, glassmorphism
- **Standard**: Solid backgrounds with subtle shadows
- **Elevated**: Higher shadows for emphasis
- **Outlined**: Border only, minimal background

## Dark Mode

### Implementation
- Automatic system preference detection
- CSS custom properties for seamless theme switching
- Consistent color mapping across light/dark modes

### Best Practices
- Test all components in both light and dark modes
- Ensure 4.5:1 contrast ratios in dark mode
- Use semantic color names (bg-primary, text-secondary, border-accent)
- Avoid pure black (#000000) in dark mode for eye comfort

## Responsive Design

### Breakpoints
- **sm**: 640px (mobile landscape)
- **md**: 768px (tablet)
- **lg**: 1024px (desktop)
- **xl**: 1280px (large desktop)
- **2xl**: 1536px (extra large)

### Mobile-First Approach
- Design for mobile first, then enhance for larger screens
- Touch targets minimum 44px
- Readable text sizes on small screens

## Animation & Motion

### Principles
- Subtle animations for feedback
- Consistent timing (200ms for interactions, 300ms for transitions)
- Respect user preferences for reduced motion

### Implementation
- Use Framer Motion for complex animations
- CSS transitions for simple state changes
- Respect `prefers-reduced-motion` media query

## Contributing

When updating the design system:
1. Update this documentation with changes
2. Test accessibility compliance (contrast, keyboard navigation)
3. Update component variants and usage examples
4. Ensure cross-platform consistency (web, mobile, desktop)
5. Document any breaking changes

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [Material Design Principles](https://material.io/design)
