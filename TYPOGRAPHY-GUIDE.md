# Enhanced Typography with Quicksand

## Overview
The ECE Trading Platform now uses **Quicksand** as the primary font throughout the entire application, providing a modern, clean, and highly readable typography system.

## Font Implementation

### 1. **Google Fonts Integration**
```tsx
import { Quicksand } from "next/font/google";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: 'swap',
});
```

### 2. **Global Font Application**
- Applied to the entire app via the root layout
- CSS custom property `--font-quicksand` available everywhere
- Tailwind configured to use Quicksand as the default sans-serif font

## Typography Scale & Classes

### **Display Text** (Largest, for hero sections)
```css
.text-display {
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.1;
}

.text-display-large   /* 6rem on desktop, 3.5rem on mobile */
.text-display-medium  /* 4.5rem on desktop, 2.875rem on mobile */
.text-display-small   /* 3.5rem on desktop, 2.25rem on mobile */
```

### **Headings** (Section titles, page headers)
```css
.text-heading {
  font-weight: 600;
  letter-spacing: -0.015em;
  line-height: 1.25;
}

.text-heading-large   /* 2.5rem on desktop, 2rem on mobile */
.text-heading-medium  /* 2.125rem on desktop, 1.75rem on mobile */
.text-heading-small   /* 1.875rem on desktop, 1.5rem on mobile */
```

### **Subheadings** (Card titles, component headers)
```css
.text-subheading {
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.3;
}

.text-subheading-large   /* 1.25rem */
.text-subheading-medium  /* 1.125rem */
.text-subheading-small   /* 1rem */
```

### **Body Text** (Paragraphs, descriptions)
```css
.text-body {
  font-weight: 400;
  letter-spacing: 0em;
  line-height: 1.5;
}

.text-body-large   /* 1rem */
.text-body-medium  /* 0.875rem */
.text-body-small   /* 0.75rem */
```

### **Caption Text** (Small labels, metadata)
```css
.text-caption {
  font-weight: 300;
  letter-spacing: 0.01em;
  line-height: 1.4;
}
```

## Usage Examples

### **Hero Section**
```tsx
<h1 className="text-display text-display-large text-foreground">
  Trade App Trading Cards
</h1>
<p className="text-subheading text-subheading-large text-muted-foreground">
  Discover, invest, and trade custom-built applications
</p>
```

### **Card Components**
```tsx
<div className="card">
  <h3 className="text-heading text-heading-small text-card-foreground">
    Card Title
  </h3>
  <p className="text-body text-body-small text-muted-foreground">
    Card description text
  </p>
</div>
```

### **Button Text**
```tsx
<button className="text-body text-body-large font-medium bg-accent text-accent-foreground">
  Action Button
</button>
```

### **Admin Interface**
```tsx
<h2 className="text-heading text-heading-medium text-foreground">
  Dashboard Section
</h2>
```

## Responsive Typography

The typography system automatically adapts to different screen sizes:

- **Mobile (< 768px)**: Smaller font sizes for better readability
- **Tablet (768px+)**: Medium font sizes
- **Desktop (1024px+)**: Full font sizes for optimal impact

## Font Weights Available

- **300**: Light (used for captions)
- **400**: Regular (used for body text)
- **500**: Medium (used for subheadings)
- **600**: Semi-bold (used for headings)
- **700**: Bold (used for display text)

## Benefits of Quicksand

1. **Modern & Clean**: Sans-serif with rounded characteristics
2. **Highly Readable**: Excellent legibility at all sizes
3. **Web Optimized**: Good performance and rendering
4. **Versatile**: Works well for both headers and body text
5. **Professional**: Suitable for business applications

## Integration with Theme System

The typography system works seamlessly with the light/dark theme:

- Uses CSS custom properties for colors
- Maintains consistent font family across themes
- Proper contrast ratios in both light and dark modes

## Migration Notes

Components have been updated to use the new typography classes:

- Replace `font-bold` with `text-heading text-heading-{size}`
- Replace `text-xl` with `text-subheading text-subheading-large`
- Replace `text-sm` with `text-body text-body-small`
- Use semantic typography classes instead of utility classes

This creates a more consistent and professional typographic hierarchy throughout the entire application.
