# Multi-Platform Consistency Templates

## Overview

This document provides templates and standards for maintaining ECE brand consistency across all platforms and touchpoints. Each template includes Beach Monokai theme integration, 3D enhancement opportunities, and responsive design patterns.

---

## Web Platform Templates

### Landing Page Template

#### Structure
```tsx
// app/src/app/page.tsx
import React from 'react';
import { SplineScene } from '@/components/3d/SplineScene';
import { Performance3DProvider } from '@/components/3d/Performance3DProvider';

export default function LandingPage() {
  return (
    <Performance3DProvider>
      <div className="min-h-screen bg-ece-dark">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Features Section */}
        <FeaturesSection />
        
        {/* Pricing Section */}
        <PricingSection />
        
        {/* Testimonials */}
        <TestimonialsSection />
        
        {/* CTA Section */}
        <CTASection />
      </div>
    </Performance3DProvider>
  );
}

// Hero Section Component
function HeroSection() {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background 3D Scene */}
      <div className="absolute inset-0">
        <SplineScene
          sceneUrl="/3d/hero-background.splinecode"
          fallback={<GradientBackground />}
          className="w-full h-full"
        />
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold text-ece-light mb-6">
            The Future of
            <span className="text-ece-accent block">Trading Cards</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-ece-muted mb-8 leading-relaxed">
            Experience immersive 3D collecting with cutting-edge technology
            and the nostalgic excitement of trading cards.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-ece-accent text-ece-light px-8 py-4 rounded-lg font-semibold text-lg hover:bg-ece-error transition-all duration-300 transform hover:scale-105">
              Start Collecting Now
            </button>
            
            <button className="border-2 border-ece-info text-ece-info px-8 py-4 rounded-lg font-semibold text-lg hover:bg-ece-info hover:text-ece-dark transition-all duration-300">
              Watch Demo Video
            </button>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-ece-muted rounded-full flex justify-center">
          <div className="w-1 h-3 bg-ece-muted rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}
```

#### Responsive Breakpoints
```css
/* tailwind.config.ts additions */
module.exports = {
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px'
    }
  }
}
```

### Navigation Template

#### Primary Navigation
```tsx
// components/ui/Navigation.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, User, ShoppingCart } from 'lucide-react';
import { ECELogo } from './ECELogo';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-ece-dark/95 backdrop-blur-md border-b border-ece-muted/20' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <ECELogo className="h-8 w-auto" />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/features">Features</NavLink>
            <NavLink href="/marketplace">Marketplace</NavLink>
            <NavLink href="/pricing">Pricing</NavLink>
            <NavLink href="/community">Community</NavLink>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-ece-muted hover:text-ece-light transition-colors">
              <ShoppingCart className="w-6 h-6" />
            </button>
            
            <button className="text-ece-muted hover:text-ece-light transition-colors">
              <User className="w-6 h-6" />
            </button>
            
            <button className="bg-ece-accent text-ece-light px-6 py-2 rounded-lg font-medium hover:bg-ece-error transition-colors">
              Sign Up
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-ece-light"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-ece-dark/95 backdrop-blur-md border-t border-ece-muted/20">
            <div className="px-4 py-6 space-y-4">
              <MobileNavLink href="/features">Features</MobileNavLink>
              <MobileNavLink href="/marketplace">Marketplace</MobileNavLink>
              <MobileNavLink href="/pricing">Pricing</MobileNavLink>
              <MobileNavLink href="/community">Community</MobileNavLink>
              
              <div className="pt-4 border-t border-ece-muted/30">
                <button className="w-full bg-ece-accent text-ece-light py-3 rounded-lg font-medium mb-3">
                  Sign Up
                </button>
                <button className="w-full border border-ece-info text-ece-info py-3 rounded-lg font-medium">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a 
      href={href}
      className="text-ece-muted hover:text-ece-light transition-colors font-medium"
    >
      {children}
    </a>
  );
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a 
      href={href}
      className="block text-ece-light hover:text-ece-accent transition-colors py-2 text-lg"
    >
      {children}
    </a>
  );
}
```

---

## Mobile Platform Templates

### React Native App Template

#### App Structure
```tsx
// apps/ece-mobile/App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';

import { ECEThemeProvider } from './src/providers/ECEThemeProvider';
import { HomeScreen } from './src/screens/HomeScreen';
import { DiscoverScreen } from './src/screens/DiscoverScreen';
import { MarketplaceScreen } from './src/screens/MarketplaceScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
    'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ECEThemeProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#272822" />
        
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#272822',
              borderTopColor: '#75715E',
              borderTopWidth: 1,
              height: 90,
              paddingBottom: 20,
              paddingTop: 10,
            },
            tabBarActiveTintColor: '#F92672',
            tabBarInactiveTintColor: '#75715E',
            tabBarLabelStyle: {
              fontSize: 12,
              fontFamily: 'Inter-Medium',
            },
          }}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <HomeIcon color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen 
            name="Discover" 
            component={DiscoverScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <CompassIcon color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen 
            name="Marketplace" 
            component={MarketplaceScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <ShoppingBagIcon color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <UserIcon color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </ECEThemeProvider>
  );
}
```

#### Theme Provider
```tsx
// apps/ece-mobile/src/providers/ECEThemeProvider.tsx
import React, { createContext, useContext } from 'react';
import { Appearance } from 'react-native';

export const ECEColors = {
  dark: '#272822',
  light: '#F8EFD6',
  muted: '#75715E',
  accent: '#F92672',
  success: '#A6E22E',
  info: '#66D9EF',
  warning: '#E6DB74',
  error: '#FD5C63',
  primary: '#819AFF',
  secondary: '#3EBA7C',
};

export const ECEGradients = {
  sunset: ['#F92672', '#FD5C63'],
  tide: ['#66D9EF', '#3EBA7C'],
  sand: ['#F8EFD6', '#819AFF'],
  ocean: ['#66D9EF', '#A6E22E'],
};

const ECEThemeContext = createContext({
  colors: ECEColors,
  gradients: ECEGradients,
  isDark: true,
});

export function ECEThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = Appearance.getColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <ECEThemeContext.Provider value={{
      colors: ECEColors,
      gradients: ECEGradients,
      isDark,
    }}>
      {children}
    </ECEThemeContext.Provider>
  );
}

export const useECETheme = () => useContext(ECEThemeContext);
```

#### Mobile Card Component
```tsx
// apps/ece-mobile/src/components/Card3DMobile.tsx
import React, { useRef } from 'react';
import { View, Text, PanGestureHandler, Animated } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { useECETheme } from '../providers/ECEThemeProvider';

interface Card3DMobileProps {
  cardData: {
    id: string;
    name: string;
    rarity: string;
    power: number;
    defense: number;
    speed: number;
    imageUrl: string;
  };
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function Card3DMobile({ cardData, onSwipeLeft, onSwipeRight }: Card3DMobileProps) {
  const { colors } = useECETheme();
  const pan = useRef(new Animated.ValueXY()).current;
  const rotation = useRef(new Animated.Value(0)).current;

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: pan.x, translationY: pan.y } }],
    { useNativeDriver: false }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === 4) { // ACTIVE
      const { translationX } = event.nativeEvent;
      
      if (Math.abs(translationX) > 150) {
        // Swipe detected
        if (translationX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
        
        // Animate card off screen
        Animated.timing(pan.x, {
          toValue: translationX > 0 ? 500 : -500,
          duration: 200,
          useNativeDriver: false,
        }).start();
      } else {
        // Return to center
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View
        style={{
          width: 280,
          height: 400,
          borderRadius: 16,
          backgroundColor: colors.dark + '95',
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { 
              rotate: pan.x.interpolate({
                inputRange: [-200, 0, 200],
                outputRange: ['-15deg', '0deg', '15deg'],
                extrapolate: 'clamp',
              }) 
            },
          ],
          shadowColor: colors.accent,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        {/* 3D Canvas */}
        <View style={{ flex: 1, borderRadius: 16, overflow: 'hidden' }}>
          <Canvas>
            {/* 3D card content would go here */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
          </Canvas>
        </View>
        
        {/* Card Info Overlay */}
        <View 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.dark + 'CC',
            padding: 16,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
          }}
        >
          <Text style={{ color: colors.light, fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>
            {cardData.name}
          </Text>
          <Text style={{ color: colors.muted, fontSize: 14, marginBottom: 8 }}>
            {cardData.rarity}
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: colors.info, fontSize: 12 }}>
              Power: {cardData.power}
            </Text>
            <Text style={{ color: colors.success, fontSize: 12 }}>
              Defense: {cardData.defense}
            </Text>
            <Text style={{ color: colors.warning, fontSize: 12 }}>
              Speed: {cardData.speed}
            </Text>
          </View>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
}
```

---

## Desktop Platform Templates

### Electron App Template

#### Main Process
```typescript
// apps/desktop/src/main.ts
import { app, BrowserWindow, Menu, shell } from 'electron';
import { join } from 'path';

let mainWindow: BrowserWindow | null = null;

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    show: false,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#272822', // ECE Dark
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: join(__dirname, 'preload.js'),
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile('dist/index.html');
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
    
    // Focus on app when opened
    if (process.platform === 'darwin') {
      app.dock.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
};

// Application menu
const createMenu = (): void => {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'ECE Trading Cards',
      submenu: [
        { label: 'About ECE Trading Cards', role: 'about' },
        { type: 'separator' },
        { label: 'Preferences', accelerator: 'CmdOrCtrl+,', click: () => openPreferences() },
        { type: 'separator' },
        { label: 'Hide ECE Trading Cards', accelerator: 'Command+H', role: 'hide' },
        { label: 'Hide Others', accelerator: 'Command+Alt+H', role: 'hideOthers' },
        { label: 'Show All', role: 'unhide' },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'CmdOrCtrl+Q', role: 'quit' }
      ]
    },
    {
      label: 'Collection',
      submenu: [
        { label: 'View Collection', accelerator: 'CmdOrCtrl+1', click: () => navigateTo('/collection') },
        { label: 'Open Pack', accelerator: 'CmdOrCtrl+O', click: () => navigateTo('/packs') },
        { label: 'Marketplace', accelerator: 'CmdOrCtrl+M', click: () => navigateTo('/marketplace') },
        { type: 'separator' },
        { label: 'Import Cards', accelerator: 'CmdOrCtrl+I', click: () => importCards() },
        { label: 'Export Collection', accelerator: 'CmdOrCtrl+E', click: () => exportCollection() }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: 'Force Reload', accelerator: 'CmdOrCtrl+Shift+R', role: 'forceReload' },
        { label: 'Toggle Developer Tools', accelerator: 'F12', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'Actual Size', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
        { label: 'Zoom In', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
        { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
        { type: 'separator' },
        { label: 'Toggle Fullscreen', accelerator: 'F11', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
        { label: 'Close', accelerator: 'CmdOrCtrl+W', role: 'close' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

// App event handlers
app.whenReady().then(() => {
  createWindow();
  createMenu();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Helper functions
const navigateTo = (path: string): void => {
  if (mainWindow) {
    mainWindow.webContents.send('navigate', path);
  }
};

const openPreferences = (): void => {
  // Open preferences window
};

const importCards = (): void => {
  // Handle card import
};

const exportCollection = (): void => {
  // Handle collection export
};
```

#### Desktop UI Layout
```tsx
// apps/desktop/src/components/DesktopLayout.tsx
import React, { useState } from 'react';
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { SidebarProvider } from '@/components/ui/sidebar';

export function DesktopLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <SidebarProvider defaultCollapsed={sidebarCollapsed}>
      <div className="h-screen bg-ece-dark flex flex-col">
        {/* Custom Title Bar */}
        <div className="h-8 bg-ece-dark border-b border-ece-muted/20 flex items-center justify-center drag-region">
          <span className="text-ece-muted text-sm font-medium">ECE Trading Cards</span>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          <ResizablePanelGroup direction="horizontal">
            {/* Sidebar */}
            <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
              <DesktopSidebar />
            </ResizablePanel>
            
            {/* Main Content */}
            <ResizablePanel defaultSize={60}>
              <main className="h-full overflow-auto">
                {children}
              </main>
            </ResizablePanel>
            
            {/* Right Panel (Collection Details) */}
            <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
              <DesktopRightPanel />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </SidebarProvider>
  );
}

function DesktopSidebar() {
  return (
    <div className="h-full bg-ece-dark/50 border-r border-ece-muted/20 p-4">
      <nav className="space-y-2">
        <SidebarItem icon="home" label="Dashboard" href="/dashboard" />
        <SidebarItem icon="collection" label="Collection" href="/collection" />
        <SidebarItem icon="discover" label="Discover" href="/discover" />
        <SidebarItem icon="marketplace" label="Marketplace" href="/marketplace" />
        <SidebarItem icon="battles" label="Battles" href="/battles" />
        <SidebarItem icon="profile" label="Profile" href="/profile" />
        
        <div className="pt-4 mt-4 border-t border-ece-muted/20">
          <SidebarItem icon="settings" label="Settings" href="/settings" />
          <SidebarItem icon="help" label="Help" href="/help" />
        </div>
      </nav>
    </div>
  );
}

function DesktopRightPanel() {
  return (
    <div className="h-full bg-ece-dark/30 border-l border-ece-muted/20 p-4">
      <div className="space-y-6">
        <div>
          <h3 className="text-ece-light font-semibold mb-3">Quick Stats</h3>
          <div className="space-y-2">
            <StatItem label="Total Cards" value="1,247" />
            <StatItem label="Rare Cards" value="89" />
            <StatItem label="Battle Wins" value="156" />
            <StatItem label="Trade Score" value="4.8" />
          </div>
        </div>
        
        <div>
          <h3 className="text-ece-light font-semibold mb-3">Recent Activity</h3>
          <div className="space-y-2">
            <ActivityItem type="trade" description="Traded Epic Card" time="2h ago" />
            <ActivityItem type="battle" description="Won Battle vs Player" time="4h ago" />
            <ActivityItem type="pack" description="Opened Mystic Pack" time="1d ago" />
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Email Platform Templates

### Transactional Email Template

#### Welcome Email
```html
<!-- emails/welcome.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ECE Trading Cards</title>
    <style>
        /* Inline styles for better email compatibility */
        .gradient-bg {
            background: linear-gradient(135deg, #272822, #3E3D32);
        }
        
        .card-container {
            background: #F8EFD6;
            border-radius: 16px;
            padding: 32px;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .button-primary {
            background: #F92672;
            color: #F8EFD6;
            padding: 16px 32px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            display: inline-block;
            margin: 16px 0;
        }
        
        .text-primary { color: #272822; }
        .text-muted { color: #75715E; }
        .text-accent { color: #F92672; }
        
        /* Responsive styles */
        @media only screen and (max-width: 600px) {
            .card-container {
                padding: 24px;
                margin: 16px;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <div class="gradient-bg" style="padding: 40px 20px;">
        <div class="card-container">
            <!-- Logo -->
            <div style="text-align: center; margin-bottom: 32px;">
                <img src="https://ece-trading-cards.com/assets/logo-dark.png" 
                     alt="ECE Trading Cards" 
                     style="height: 48px; width: auto;">
            </div>
            
            <!-- Welcome Message -->
            <h1 class="text-primary" style="font-size: 32px; font-weight: bold; margin-bottom: 16px; text-align: center;">
                Welcome to the Future!
            </h1>
            
            <p class="text-muted" style="font-size: 18px; line-height: 1.6; margin-bottom: 24px; text-align: center;">
                Thank you for joining ECE Trading Cards. You're now part of a revolutionary 
                community that's redefining digital collecting.
            </p>
            
            <!-- 3D Card Preview -->
            <div style="text-align: center; margin: 32px 0;">
                <img src="https://ece-trading-cards.com/assets/welcome-card-preview.gif" 
                     alt="3D Card Animation" 
                     style="max-width: 100%; height: auto; border-radius: 12px;">
            </div>
            
            <!-- Getting Started */
            <div style="background: rgba(102, 217, 239, 0.1); border-radius: 12px; padding: 24px; margin: 24px 0;">
                <h3 class="text-primary" style="font-size: 20px; font-weight: 600; margin-bottom: 16px;">
                    🚀 Get Started in 3 Easy Steps
                </h3>
                
                <ol style="padding-left: 20px; color: #75715E; line-height: 1.8;">
                    <li style="margin-bottom: 8px;">
                        <strong style="color: #272822;">Open your first pack</strong> - 
                        We've given you a starter pack to begin your collection
                    </li>
                    <li style="margin-bottom: 8px;">
                        <strong style="color: #272822;">Explore in 3D</strong> - 
                        Tap and swipe to interact with your cards
                    </li>
                    <li style="margin-bottom: 8px;">
                        <strong style="color: #272822;">Join the community</strong> - 
                        Trade with collectors worldwide
                    </li>
                </ol>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 32px 0;">
                <a href="https://ece-trading-cards.com/app" class="button-primary">
                    Open Your First Pack
                </a>
            </div>
            
            <!-- Starter Pack Details -->
            <div style="border: 2px dashed #A6E22E; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
                <h4 class="text-primary" style="margin-bottom: 12px; font-size: 18px;">
                    🎁 Your Starter Pack Includes:
                </h4>
                <p class="text-muted" style="margin: 0; font-size: 14px;">
                    5 Common Cards • 1 Rare Card • 500 ECE Coins • Battle Pass Access
                </p>
            </div>
            
            <!-- Social Links -->
            <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #E6E6E6;">
                <p class="text-muted" style="margin-bottom: 16px; font-size: 14px;">
                    Follow us for updates and tips:
                </p>
                
                <div style="display: inline-block;">
                    <a href="https://twitter.com/ece_cards" style="margin: 0 8px;">
                        <img src="https://ece-trading-cards.com/assets/social/twitter.png" 
                             alt="Twitter" 
                             style="width: 24px; height: 24px;">
                    </a>
                    <a href="https://discord.gg/ece-cards" style="margin: 0 8px;">
                        <img src="https://ece-trading-cards.com/assets/social/discord.png" 
                             alt="Discord" 
                             style="width: 24px; height: 24px;">
                    </a>
                    <a href="https://instagram.com/ece_cards" style="margin: 0 8px;">
                        <img src="https://ece-trading-cards.com/assets/social/instagram.png" 
                             alt="Instagram" 
                             style="width: 24px; height: 24px;">
                    </a>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #E6E6E6;">
                <p class="text-muted" style="font-size: 12px; margin: 0;">
                    ECE Trading Cards, Inc. • 123 Future Street, Tech City, TC 12345
                </p>
                <p class="text-muted" style="font-size: 12px; margin: 8px 0 0 0;">
                    <a href="https://ece-trading-cards.com/unsubscribe" style="color: #75715E;">Unsubscribe</a> • 
                    <a href="https://ece-trading-cards.com/privacy" style="color: #75715E;">Privacy Policy</a>
                </p>
            </div>
        </div>
    </div>
</body>
</html>
```

### Email Campaign Template

#### New Collection Announcement
```html
<!-- emails/new-collection.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🌌 Cosmic Series - Limited Edition Release</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <!-- Cosmic Background -->
    <div style="background: linear-gradient(135deg, #272822, #1a1a1a, #2e2e4f); padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto;">
            
            <!-- Header with Animation -->
            <div style="text-align: center; margin-bottom: 40px;">
                <img src="https://ece-trading-cards.com/assets/cosmic-series-header.gif" 
                     alt="Cosmic Series" 
                     style="max-width: 100%; height: auto;">
            </div>
            
            <!-- Main Content Card -->
            <div style="background: rgba(248, 239, 214, 0.95); border-radius: 20px; padding: 40px; backdrop-filter: blur(10px);">
                
                <!-- Announcement -->
                <div style="text-align: center; margin-bottom: 32px;">
                    <h1 style="color: #272822; font-size: 36px; font-weight: bold; margin-bottom: 16px; background: linear-gradient(90deg, #F92672, #66D9EF); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        Cosmic Series
                    </h1>
                    <p style="color: #272822; font-size: 18px; font-weight: 600; margin: 0;">
                        Limited Edition • Available for 72 Hours Only
                    </p>
                </div>
                
                <!-- Hero Image -->
                <div style="text-align: center; margin: 32px 0;">
                    <img src="https://ece-trading-cards.com/assets/cosmic-hero-card.jpg" 
                         alt="Cosmic Hero Card" 
                         style="max-width: 100%; height: auto; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
                </div>
                
                <!-- Collection Details -->
                <div style="background: linear-gradient(135deg, rgba(102, 217, 239, 0.1), rgba(166, 226, 46, 0.1)); border-radius: 16px; padding: 24px; margin: 24px 0;">
                    <h3 style="color: #272822; font-size: 22px; font-weight: 600; margin-bottom: 16px; text-align: center;">
                        ✨ What Makes This Special
                    </h3>
                    
                    <div style="display: grid; gap: 16px;">
                        <div style="display: flex; align-items: center;">
                            <span style="color: #F92672; font-size: 20px; margin-right: 12px;">🌟</span>
                            <span style="color: #272822; font-weight: 500;">Legendary "Galaxy Guardian" card with exclusive animations</span>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <span style="color: #66D9EF; font-size: 20px; margin-right: 12px;">🎭</span>
                            <span style="color: #272822; font-weight: 500;">Holographic effects that react to device movement</span>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <span style="color: #A6E22E; font-size: 20px; margin-right: 12px;">🏆</span>
                            <span style="color: #272822; font-weight: 500;">Access to exclusive Cosmic Tournament</span>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <span style="color: #E6DB74; font-size: 20px; margin-right: 12px;">🎨</span>
                            <span style="color: #272822; font-weight: 500;">Custom cosmic frames for your collection</span>
                        </div>
                    </div>
                </div>
                
                <!-- Countdown Timer -->
                <div style="background: #272822; color: #F8EFD6; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
                    <h4 style="margin-bottom: 12px; font-size: 16px;">⏰ Limited Time Offer Ends In:</h4>
                    <div style="font-size: 24px; font-weight: bold; color: #F92672;">
                        2 Days 14 Hours 32 Minutes
                    </div>
                </div>
                
                <!-- Pricing Options -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 32px 0;">
                    <!-- Standard Pack -->
                    <div style="border: 2px solid #66D9EF; border-radius: 12px; padding: 20px; text-align: center;">
                        <h4 style="color: #272822; margin-bottom: 8px;">Cosmic Pack</h4>
                        <div style="color: #F92672; font-size: 24px; font-weight: bold; margin-bottom: 8px;">$19.99</div>
                        <p style="color: #75715E; font-size: 14px; margin: 0;">3 Cosmic Cards<br>1 Guaranteed Rare</p>
                    </div>
                    
                    <!-- Premium Pack -->
                    <div style="border: 2px solid #F92672; border-radius: 12px; padding: 20px; text-align: center; position: relative; background: linear-gradient(135deg, rgba(249, 38, 114, 0.1), transparent);">
                        <div style="position: absolute; top: -8px; left: 50%; transform: translateX(-50%); background: #F92672; color: #F8EFD6; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                            BEST VALUE
                        </div>
                        <h4 style="color: #272822; margin-bottom: 8px;">Cosmic Elite Pack</h4>
                        <div style="color: #F92672; font-size: 24px; font-weight: bold; margin-bottom: 8px;">$49.99</div>
                        <p style="color: #75715E; font-size: 14px; margin: 0;">8 Cosmic Cards<br>1 Guaranteed Legendary</p>
                    </div>
                </div>
                
                <!-- CTA Buttons -->
                <div style="text-align: center; margin: 32px 0;">
                    <a href="https://ece-trading-cards.com/cosmic-series" 
                       style="background: linear-gradient(90deg, #F92672, #FD5C63); color: #F8EFD6; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 18px; display: inline-block; margin: 8px; box-shadow: 0 8px 16px rgba(249, 38, 114, 0.3);">
                        Get Cosmic Packs Now
                    </a>
                    
                    <br>
                    
                    <a href="https://ece-trading-cards.com/cosmic-preview" 
                       style="border: 2px solid #66D9EF; color: #66D9EF; padding: 14px 30px; border-radius: 12px; text-decoration: none; font-weight: 600; display: inline-block; margin: 8px;">
                        Preview Collection
                    </a>
                </div>
                
                <!-- Early Access Notice -->
                <div style="background: rgba(166, 226, 46, 0.2); border-left: 4px solid #A6E22E; padding: 16px; border-radius: 8px; margin: 24px 0;">
                    <p style="color: #272822; font-weight: 600; margin: 0; font-size: 14px;">
                        🎯 VIP Members get 24-hour early access + 15% discount! 
                        <a href="https://ece-trading-cards.com/vip" style="color: #F92672; text-decoration: none;">Upgrade to VIP →</a>
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 32px;">
                <p style="color: #75715E; font-size: 14px; margin-bottom: 16px;">
                    Happy Collecting,<br>
                    <span style="color: #F8EFD6; font-weight: 600;">The ECE Team</span>
                </p>
                
                <div style="margin: 16px 0;">
                    <a href="https://twitter.com/ece_cards" style="margin: 0 8px;">
                        <img src="https://ece-trading-cards.com/assets/social/twitter-light.png" 
                             alt="Twitter" style="width: 20px; height: 20px;">
                    </a>
                    <a href="https://discord.gg/ece-cards" style="margin: 0 8px;">
                        <img src="https://ece-trading-cards.com/assets/social/discord-light.png" 
                             alt="Discord" style="width: 20px; height: 20px;">
                    </a>
                </div>
                
                <p style="color: #75715E; font-size: 12px;">
                    <a href="https://ece-trading-cards.com/unsubscribe" style="color: #75715E;">Unsubscribe</a> • 
                    <a href="https://ece-trading-cards.com/preferences" style="color: #75715E;">Email Preferences</a>
                </p>
            </div>
        </div>
    </div>
</body>
</html>
```

---

## Social Media Templates

### Instagram Post Template

#### Story Template
```tsx
// tools/social-media/InstagramStoryTemplate.tsx
import React from 'react';

interface InstagramStoryProps {
  cardImage: string;
  cardName: string;
  rarity: string;
  userHandle: string;
  achievement?: string;
}

export function InstagramStoryTemplate({
  cardImage,
  cardName,
  rarity,
  userHandle,
  achievement
}: InstagramStoryProps) {
  return (
    <div className="w-[375px] h-[667px] relative overflow-hidden bg-gradient-sunset">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url('/patterns/ece-pattern.png')`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>
      
      {/* ECE Branding */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="/logo/ece-icon-white.png" alt="ECE" className="w-8 h-8" />
          <span className="text-ece-light font-bold text-lg">ECE</span>
        </div>
        
        <div className="text-ece-light text-sm">
          @{userHandle}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="absolute inset-x-6 top-24 bottom-32">
        {/* Card Image */}
        <div className="relative mb-6">
          <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-ece-dark/20 backdrop-blur-sm border border-ece-light/20">
            <img 
              src={cardImage} 
              alt={cardName}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Rarity Badge */}
          <div className="absolute top-4 right-4 bg-ece-accent text-ece-light px-3 py-1 rounded-full text-sm font-semibold">
            {rarity}
          </div>
        </div>
        
        {/* Card Info */}
        <div className="text-center">
          <h2 className="text-ece-light text-2xl font-bold mb-2">
            {cardName}
          </h2>
          
          {achievement && (
            <div className="bg-ece-success/20 border border-ece-success rounded-lg px-4 py-2 mb-4">
              <span className="text-ece-light text-sm font-medium">
                🏆 {achievement}
              </span>
            </div>
          )}
          
          <p className="text-ece-light/80 text-sm">
            Just added to my collection! 
            <br />
            Who wants to trade? 👀
          </p>
        </div>
      </div>
      
      {/* Bottom CTA */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-ece-light rounded-2xl p-4 text-center">
          <p className="text-ece-dark font-semibold mb-2">
            Start Your Collection
          </p>
          <p className="text-ece-muted text-sm">
            ece-trading-cards.com
          </p>
        </div>
      </div>
    </div>
  );
}
```

### Twitter/X Post Templates

#### Achievement Share
```tsx
// tools/social-media/TwitterTemplate.tsx
export function TwitterAchievementPost({
  achievement,
  cardName,
  stats,
  userHandle
}: TwitterPostProps) {
  return (
    <div className="max-w-md bg-ece-dark rounded-xl p-6 text-ece-light">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <img src="/logo/ece-icon.png" alt="ECE" className="w-10 h-10" />
        <div>
          <div className="font-bold">ECE Trading Cards</div>
          <div className="text-ece-muted text-sm">@ece_cards</div>
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-3">
        <p className="text-lg">
          🎉 Congratulations @{userHandle}! 
        </p>
        
        <p className="text-ece-light">
          You just unlocked <span className="text-ece-accent font-semibold">{cardName}</span> - 
          a legendary card with incredible stats!
        </p>
        
        <div className="bg-ece-muted/20 rounded-lg p-3">
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div>
              <div className="text-ece-info font-semibold">{stats.power}</div>
              <div className="text-ece-muted">Power</div>
            </div>
            <div>
              <div className="text-ece-success font-semibold">{stats.defense}</div>
              <div className="text-ece-muted">Defense</div>
            </div>
            <div>
              <div className="text-ece-warning font-semibold">{stats.speed}</div>
              <div className="text-ece-muted">Speed</div>
            </div>
          </div>
        </div>
        
        <p className="text-ece-info">
          Ready to start your own collection? 
          <br />
          🔗 ece-trading-cards.com
        </p>
        
        <div className="text-ece-muted text-sm">
          #ECETradingCards #DigitalCollectibles #Gaming #NFT #TradingCards
        </div>
      </div>
    </div>
  );
}
```

---

## Quality Assurance Checklist

### Cross-Platform Validation

#### Design Consistency ✅
- [ ] Beach Monokai colors match across all platforms
- [ ] Typography scales appropriately on each device
- [ ] Logo placement and sizing follows brand guidelines
- [ ] Interactive elements have consistent behavior
- [ ] Loading states use branded messaging

#### Technical Standards ✅
- [ ] Performance benchmarks met on each platform
- [ ] 3D fallbacks work properly on low-end devices
- [ ] Responsive design tested on all screen sizes
- [ ] Accessibility standards (WCAG 2.1 AA) achieved
- [ ] Cross-browser compatibility verified

#### Content Quality ✅
- [ ] Voice and tone consistent across touchpoints
- [ ] Error messages are helpful and branded
- [ ] Success states celebrate user achievements
- [ ] Call-to-action buttons are clear and compelling
- [ ] Loading messages provide context and anticipation

#### User Experience ✅
- [ ] Navigation patterns are intuitive across platforms
- [ ] Key user flows work seamlessly
- [ ] Performance feels fast and responsive
- [ ] 3D elements enhance rather than distract
- [ ] Accessibility features work properly

### Template Usage Guidelines

#### Implementation Process
1. **Choose Appropriate Template**: Select based on platform and use case
2. **Customize Content**: Replace placeholder content with actual data
3. **Test Responsive Behavior**: Verify on multiple screen sizes
4. **Validate Brand Compliance**: Check against brand guidelines
5. **Performance Test**: Ensure 3D elements don't impact performance
6. **Accessibility Audit**: Verify all users can access content
7. **Deploy and Monitor**: Track performance and user feedback

#### Maintenance Schedule
- **Weekly**: Performance monitoring and optimization
- **Bi-weekly**: Content updates and seasonal adjustments
- **Monthly**: Brand compliance audit
- **Quarterly**: Template updates and new platform additions

---

**Multi-Platform Templates Version**: 3.0.0  
**Last Updated**: July 18, 2025  
**Coverage**: Web, Mobile, Desktop, Email, Social Media  
**Maintained By**: ECE Design System Team
