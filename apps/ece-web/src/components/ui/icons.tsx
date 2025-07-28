'use client';

import React from 'react';
import { 
  // Navigation Icons
  Home, 
  Search, 
  ShoppingCart, 
  User, 
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  
  // Action Icons
  Plus,
  Minus,
  Edit,
  Trash2,
  Save,
  Download,
  Upload,
  Share,
  Copy,
  ExternalLink,
  
  // Status Icons
  Check,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  XCircle,
  Clock,
  Loader,
  
  // Financial Icons
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Wallet,
  PieChart,
  BarChart3,
  LineChart,
  
  // Social Icons
  Heart,
  MessageCircle,
  Users,
  UserPlus,
  Star,
  ThumbsUp,
  ThumbsDown,
  Flag,
  
  // Trading Icons
  Zap,
  Target,
  Award,
  Trophy,
  Medal,
  Crown,
  Gem,
  Coins,
  
  // Tech Icons
  Code,
  Github,
  Database,
  Server,
  Cloud,
  Smartphone,
  Monitor,
  Tablet,
  
  // UI Icons
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Shield,
  Key,
  Filter,
  Sort,
  
  // Media Icons
  Play,
  Pause,
  Volume2,
  VolumeX,
  Image,
  Video,
  Camera,
  Mic,
  
  // Theme Icons
  Sun,
  Moon,
  Palette,
  Contrast,
  
  type LucideIcon
} from 'lucide-react';

export interface IconProps {
  name: keyof typeof iconMap;
  size?: number | string;
  className?: string;
  color?: string;
  strokeWidth?: number;
  variant?: 'default' | 'filled' | 'outline';
  theme?: 'light' | 'dark' | 'auto';
}

// Comprehensive icon mapping
export const iconMap = {
  // Navigation
  home: Home,
  search: Search,
  cart: ShoppingCart,
  user: User,
  settings: Settings,
  menu: Menu,
  close: X,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
  
  // Actions
  plus: Plus,
  minus: Minus,
  edit: Edit,
  delete: Trash2,
  save: Save,
  download: Download,
  upload: Upload,
  share: Share,
  copy: Copy,
  'external-link': ExternalLink,
  
  // Status
  check: Check,
  'check-circle': CheckCircle,
  'alert-circle': AlertCircle,
  'alert-triangle': AlertTriangle,
  info: Info,
  'x-circle': XCircle,
  clock: Clock,
  loader: Loader,
  
  // Financial
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  dollar: DollarSign,
  'credit-card': CreditCard,
  wallet: Wallet,
  'pie-chart': PieChart,
  'bar-chart': BarChart3,
  'line-chart': LineChart,
  
  // Social
  heart: Heart,
  message: MessageCircle,
  users: Users,
  'user-plus': UserPlus,
  star: Star,
  'thumbs-up': ThumbsUp,
  'thumbs-down': ThumbsDown,
  flag: Flag,
  
  // Trading
  zap: Zap,
  target: Target,
  award: Award,
  trophy: Trophy,
  medal: Medal,
  crown: Crown,
  gem: Gem,
  coins: Coins,
  
  // Tech
  code: Code,
  github: Github,
  database: Database,
  server: Server,
  cloud: Cloud,
  mobile: Smartphone,
  desktop: Monitor,
  tablet: Tablet,
  
  // Security
  eye: Eye,
  'eye-off': EyeOff,
  lock: Lock,
  unlock: Unlock,
  shield: Shield,
  key: Key,
  filter: Filter,
  sort: Sort,
  
  // Media
  play: Play,
  pause: Pause,
  'volume-on': Volume2,
  'volume-off': VolumeX,
  image: Image,
  video: Video,
  camera: Camera,
  microphone: Mic,
  
  // Theme
  sun: Sun,
  moon: Moon,
  palette: Palette,
  contrast: Contrast,
} as const;

// Theme-aware color mapping
const getThemeColors = (theme: IconProps['theme'], variant: IconProps['variant']) => {
  const isLight = theme === 'light' || (theme === 'auto' && typeof window !== 'undefined' && !window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  const colors = {
    light: {
      default: '#272822', // Dark text for light theme
      filled: '#819AFF',  // Brand primary
      outline: '#75715E', // Muted
    },
    dark: {
      default: '#F8EFD6', // Light text for dark theme
      filled: '#66D9EF',  // Brand secondary
      outline: '#75715E', // Muted
    }
  };

  return colors[isLight ? 'light' : 'dark'][variant || 'default'];
};

// Main Icon component
export function Icon({ 
  name, 
  size = 24, 
  className = '', 
  color, 
  strokeWidth = 2,
  variant = 'default',
  theme = 'auto',
  ...props 
}: IconProps) {
  const IconComponent = iconMap[name] as LucideIcon;
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return null;
  }

  const themeColor = color || getThemeColors(theme, variant);
  
  const variantClasses = {
    default: '',
    filled: 'fill-current',
    outline: 'fill-none',
  };

  return (
    <IconComponent
      size={size}
      color={themeColor}
      strokeWidth={strokeWidth}
      className={`${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}

// Specific icon components for common use cases
export function NavigationIcon({ name, ...props }: Omit<IconProps, 'name'> & { name: 'home' | 'search' | 'cart' | 'user' | 'settings' }) {
  return <Icon name={name} variant="outline" {...props} />;
}

export function ActionIcon({ name, ...props }: Omit<IconProps, 'name'> & { name: 'plus' | 'edit' | 'delete' | 'save' | 'share' }) {
  return <Icon name={name} variant="default" {...props} />;
}

export function StatusIcon({ name, ...props }: Omit<IconProps, 'name'> & { name: 'check' | 'check-circle' | 'alert-circle' | 'info' | 'x-circle' }) {
  const statusColors = {
    'check': '#A6E22E',
    'check-circle': '#A6E22E',
    'alert-circle': '#F92672',
    'info': '#66D9EF',
    'x-circle': '#F92672',
  };
  
  return <Icon name={name} color={statusColors[name]} variant="filled" {...props} />;
}

export function TradingIcon({ name, ...props }: Omit<IconProps, 'name'> & { name: 'zap' | 'target' | 'award' | 'trophy' | 'crown' | 'gem' }) {
  return <Icon name={name} variant="filled" color="#819AFF" {...props} />;
}

export function SocialIcon({ name, ...props }: Omit<IconProps, 'name'> & { name: 'heart' | 'message' | 'users' | 'star' | 'thumbs-up' }) {
  return <Icon name={name} variant="outline" {...props} />;
}

// Icon size presets
export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

// Export all icons for direct use
export {
  Home,
  Search,
  ShoppingCart,
  User,
  Settings,
  Menu,
  X,
  Plus,
  Edit,
  Trash2,
  Check,
  AlertCircle,
  Star,
  Zap,
  TrendingUp,
  Heart,
  Code,
  Shield,
  type LucideIcon,
};

// Default export
export default Icon;
