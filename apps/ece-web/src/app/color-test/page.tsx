'use client'

import { GlassCard } from '../../components/ui/glass-card'
import { Button } from '../../components/ui/button'
import { ThemeToggle } from '../../components/theme-toggle'

export default function ColorTestPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Monokai Beach Color Test
          </h1>
          <p className="text-muted-foreground">
            Testing all color variables and gradients in light/dark modes
          </p>
          <div className="flex gap-4 justify-center">
            <ThemeToggle />
            <p className="text-sm text-muted-foreground">
              Toggle between light, dark, and system themes
            </p>
          </div>
        </div>

        {/* CSS Variables Test */}
        <GlassCard className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">CSS Variables</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-lg" style={{backgroundColor: 'hsl(var(--background))'}}></div>
              <p className="text-sm text-foreground">Background</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-lg" style={{backgroundColor: 'hsl(var(--foreground))'}}></div>
              <p className="text-sm text-foreground">Foreground</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-lg" style={{backgroundColor: 'hsl(var(--primary))'}}></div>
              <p className="text-sm text-foreground">Primary</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-lg" style={{backgroundColor: 'hsl(var(--secondary))'}}></div>
              <p className="text-sm text-foreground">Secondary</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-lg" style={{backgroundColor: 'hsl(var(--accent))'}}></div>
              <p className="text-sm text-foreground">Accent</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-lg" style={{backgroundColor: 'hsl(var(--destructive))'}}></div>
              <p className="text-sm text-foreground">Destructive</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-lg" style={{backgroundColor: 'hsl(var(--muted))'}}></div>
              <p className="text-sm text-foreground">Muted</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-lg border" style={{backgroundColor: 'hsl(var(--card))'}}></div>
              <p className="text-sm text-foreground">Card</p>
            </div>
          </div>
        </GlassCard>

        {/* Beach Color Variables */}
        <GlassCard className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Beach Monokai Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-lg bg-beach-accent"></div>
              <p className="text-sm text-foreground">Accent (#F92672)</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-lg bg-beach-success"></div>
              <p className="text-sm text-foreground">Success (#A6E22E)</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-lg bg-beach-info"></div>
              <p className="text-sm text-foreground">Info (#66D9EF)</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-lg bg-beach-secondary"></div>
              <p className="text-sm text-foreground">Secondary (#E6DB74)</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-lg bg-beach-light border"></div>
              <p className="text-sm text-foreground">Light (#F8EFD6)</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-lg bg-beach-dark"></div>
              <p className="text-sm text-foreground">Dark (#272822)</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-lg bg-beach-primary"></div>
              <p className="text-sm text-foreground">Primary (#819AFF)</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-lg bg-beach-success-tone"></div>
              <p className="text-sm text-foreground">Success Tone (#3EBA7C)</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-lg bg-beach-muted"></div>
              <p className="text-sm text-foreground">Muted (#75715E)</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-lg bg-beach-alert"></div>
              <p className="text-sm text-foreground">Alert (#FD5C63)</p>
            </div>
          </div>
        </GlassCard>

        {/* Gradients */}
        <GlassCard className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Beach Gradients</h2>
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-foreground mb-2">Sunset Horizon</p>
              <div className="h-16 w-full rounded-lg bg-gradient-ocean"></div>
            </div>
            <div>
              <p className="text-sm text-foreground mb-2">Tide Line</p>
              <div className="h-16 w-full rounded-lg bg-gradient-tide"></div>
            </div>
            <div>
              <p className="text-sm text-foreground mb-2">Sand to Surf</p>
              <div className="h-16 w-full rounded-lg bg-gradient-sand-surf"></div>
            </div>
          </div>
        </GlassCard>

        {/* Button Test */}
        <GlassCard className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Button Variants</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="accent">Accent Button</Button>
            <Button variant="ghost">Ghost Button</Button>
          </div>
        </GlassCard>

        {/* Glass Card Variants */}
        <div className="grid md:grid-cols-3 gap-6">
          <GlassCard variant="default" className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Default Glass</h3>
            <p className="text-muted-foreground">Default glassmorphism effect</p>
          </GlassCard>
          <GlassCard variant="light" className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Light Glass</h3>
            <p className="text-muted-foreground">Light variant with beach-light background</p>
          </GlassCard>
          <GlassCard variant="dark" className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Dark Glass</h3>
            <p className="text-muted-foreground">Dark variant with beach-dark background</p>
          </GlassCard>
        </div>

        {/* Animation Test */}
        <GlassCard className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Animation Test</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <GlassCard variant="default" animation="wave" className="p-4 text-center">
              <p className="text-foreground">Wave Animation</p>
            </GlassCard>
            <GlassCard variant="default" animation="breathe" className="p-4 text-center">
              <p className="text-foreground">Breathe Animation</p>
            </GlassCard>
            <GlassCard variant="default" animation="float" className="p-4 text-center">
              <p className="text-foreground">Float Animation</p>
            </GlassCard>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
