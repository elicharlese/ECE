# ECE UI Components Documentation

## Overview

The ECE platform uses a shared UI library built with React and Tailwind CSS, following atomic component design principles. All components are designed to be reusable, accessible, and responsive.

## Components

### Button

A versatile button component with multiple variants and sizes for different use cases.

#### Usage

```tsx
import { Button } from '@ece-platform/shared-ui';

<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>
```

#### Props

- `variant`: 'primary' | 'secondary' | 'outline' - Defines the visual style
- `size`: 'sm' | 'md' | 'lg' - Defines the button size
- `onClick`: () => void - Click handler function
- `className`: string - Additional Tailwind CSS classes

#### Variants

- **Primary**: Solid button with primary color
- **Secondary**: Outlined button with secondary styling
- **Outline**: Minimal outlined button

### GlassCard

A card component with glassmorphism effect for modern, translucent UI elements.

#### Usage

```tsx
import { GlassCard } from '@ece-platform/shared-ui';

<GlassCard className="p-6">
  <h2 className="text-xl font-bold mb-4">Card Title</h2>
  <p className="text-gray-600">Card content with glassmorphism effect</p>
</GlassCard>
```

#### Props

- `className`: string - Additional Tailwind CSS classes for styling
- `children`: ReactNode - Card content

#### Features

- Translucent background with blur effect
- Subtle border and shadow
- Responsive design

## Design Principles

### Atomic Design
- Components are built as small, reusable atoms
- Consistent styling across the platform
- Easy to maintain and extend

### Accessibility
- All components support keyboard navigation
- Proper ARIA labels and roles
- High contrast ratios for readability

### Responsive Design
- Mobile-first approach
- Flexible layouts that adapt to screen sizes
- Touch-friendly interactive elements

## File Structure

```
libs/shared-ui/
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   └── GlassCard.tsx
│   └── index.ts
└── package.json
```

## Contributing

When adding new components:
1. Follow PascalCase naming convention
2. Include TypeScript types for all props
3. Add proper JSDoc comments
4. Test for accessibility and responsiveness
5. Update this documentation
