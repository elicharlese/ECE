'use client';

import React from 'react';
import { 
  Star, 
  Zap, 
  Shield, 
  Users, 
  Settings,
  Database,
  Cloud,
  Code,
  Palette,
  CheckCircle,
  Clock,
  AlertCircle,
  Trophy,
  TrendingUp,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Download,
  Upload,
  Edit,
  Trash2,
  Plus,
  Minus,
  Search,
  Filter,
  Sort,
  Grid,
  List,
  Map,
  Calendar,
  Mail,
  Phone,
  Globe,
  Lock,
  Unlock,
  Key,
  User,
  UserPlus,
  UserMinus,
  Home,
  Building,
  Briefcase,
  CreditCard,
  DollarSign,
  Target,
  Award,
  Gift,
  Sparkles,
  Flame,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Camera,
  Video,
  Mic,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  RefreshCw,
  RotateCcw,
  Maximize,
  Minimize,
  X,
  Menu,
  MoreHorizontal,
  MoreVertical,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Link,
  Copy,
  FileText,
  File,
  Folder,
  FolderOpen,
  Image,
  BookOpen,
  Bookmark,
  Tag,
  Hash,
  Bell,
  BellOff,
  Inbox,
  Send,
  Archive,
  Flag,
  PieChart,
  BarChart3,
  LineChart,
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  WifiOff,
  Signal,
  Battery,
  Power,
  PowerOff
} from 'lucide-react';

// Icon variants for different themes and states
export type IconVariant = 'default' | 'light' | 'dark' | 'success' | 'warning' | 'error' | 'info';
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface IconProps {
  name: string;
  variant?: IconVariant;
  size?: IconSize;
  className?: string;
  onClick?: () => void;
}

// Comprehensive icon mapping
const iconMapping = {
  // Core Actions
  star: Star,
  zap: Zap,
  shield: Shield,
  users: Users,
  settings: Settings,
  database: Database,
  cloud: Cloud,
  code: Code,
  palette: Palette,
  
  // Status Icons
  'check-circle': CheckCircle,
  clock: Clock,
  'alert-circle': AlertCircle,
  trophy: Trophy,
  'trending-up': TrendingUp,
  
  // Social Icons
  heart: Heart,
  'message-circle': MessageCircle,
  share2: Share2,
  eye: Eye,
  
  // File Operations
  download: Download,
  upload: Upload,
  edit: Edit,
  trash2: Trash2,
  copy: Copy,
  
  // Navigation
  plus: Plus,
  minus: Minus,
  search: Search,
  filter: Filter,
  sort: Sort,
  grid: Grid,
  list: List,
  map: Map,
  
  // Communication
  calendar: Calendar,
  mail: Mail,
  phone: Phone,
  globe: Globe,
  
  // Security
  lock: Lock,
  unlock: Unlock,
  key: Key,
  
  // User Management
  user: User,
  'user-plus': UserPlus,
  'user-minus': UserMinus,
  
  // Business
  home: Home,
  building: Building,
  briefcase: Briefcase,
  'credit-card': CreditCard,
  'dollar-sign': DollarSign,
  target: Target,
  award: Award,
  gift: Gift,
  
  // Effects
  sparkles: Sparkles,
  flame: Flame,
  
  // Theme
  moon: Moon,
  sun: Sun,
  monitor: Monitor,
  
  // Devices
  smartphone: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
  
  // Media
  camera: Camera,
  video: Video,
  mic: Mic,
  volume2: Volume2,
  'volume-x': VolumeX,
  
  // Media Controls
  play: Play,
  pause: Pause,
  square: Square,
  'skip-back': SkipBack,
  'skip-forward': SkipForward,
  'refresh-cw': RefreshCw,
  'rotate-ccw': RotateCcw,
  
  // Layout
  maximize: Maximize,
  minimize: Minimize,
  x: X,
  menu: Menu,
  'more-horizontal': MoreHorizontal,
  'more-vertical': MoreVertical,
  
  // Directional
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  
  // Links
  'external-link': ExternalLink,
  link: Link,
  
  // Files
  'file-text': FileText,
  file: File,
  folder: Folder,
  'folder-open': FolderOpen,
  image: Image,
  'book-open': BookOpen,
  bookmark: Bookmark,
  tag: Tag,
  hash: Hash,
  
  // Notifications
  bell: Bell,
  'bell-off': BellOff,
  inbox: Inbox,
  send: Send,
  archive: Archive,
  flag: Flag,
  
  // Analytics
  'pie-chart': PieChart,
  'bar-chart-3': BarChart3,
  'line-chart': LineChart,
  activity: Activity,
  
  // System
  cpu: Cpu,
  'hard-drive': HardDrive,
  wifi: Wifi,
  'wifi-off': WifiOff,
  signal: Signal,
  battery: Battery,
  power: Power,
  'power-off': PowerOff
};

// Size mappings
const sizeMapping = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-10 h-10'
};

// Variant color mappings for beach monokai theme
const variantMapping = {
  default: 'text-[#F8EFD6]',
  light: 'text-[#F8EFD6]',
  dark: 'text-[#272822]',
  success: 'text-[#A6E22E]',
  warning: 'text-[#E6DB74]',
  error: 'text-[#F92672]',
  info: 'text-[#66D9EF]'
};

export function Icon({ name, variant = 'default', size = 'md', className = '', onClick }: IconProps) {
  const IconComponent = iconMapping[name as keyof typeof iconMapping];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in icon mapping`);
    return <AlertCircle className={`${sizeMapping[size]} text-[#F92672]`} />;
  }
  
  const baseClasses = `${sizeMapping[size]} ${variantMapping[variant]} transition-colors duration-200`;
  const interactiveClasses = onClick ? 'cursor-pointer hover:opacity-80 active:scale-95' : '';
  
  return (
    <IconComponent 
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
    />
  );
}

// Preset icon combinations for common use cases
export function StatusIcon({ status, size = 'sm' }: { status: 'success' | 'warning' | 'error' | 'info' | 'pending', size?: IconSize }) {
  const statusIcons = {
    success: { name: 'check-circle', variant: 'success' as IconVariant },
    warning: { name: 'alert-circle', variant: 'warning' as IconVariant },
    error: { name: 'alert-circle', variant: 'error' as IconVariant },
    info: { name: 'alert-circle', variant: 'info' as IconVariant },
    pending: { name: 'clock', variant: 'default' as IconVariant }
  };
  
  const config = statusIcons[status];
  return <Icon name={config.name} variant={config.variant} size={size} />;
}

export function PriorityIcon({ priority, size = 'sm' }: { priority: 'critical' | 'high' | 'medium' | 'low', size?: IconSize }) {
  const priorityIcons = {
    critical: { name: 'alert-circle', variant: 'error' as IconVariant },
    high: { name: 'trending-up', variant: 'warning' as IconVariant },
    medium: { name: 'minus', variant: 'info' as IconVariant },
    low: { name: 'arrow-down', variant: 'default' as IconVariant }
  };
  
  const config = priorityIcons[priority];
  return <Icon name={config.name} variant={config.variant} size={size} />;
}

export function ThemeIcon({ theme, size = 'md' }: { theme: 'light' | 'dark' | 'auto', size?: IconSize }) {
  const themeIcons = {
    light: 'sun',
    dark: 'moon',
    auto: 'monitor'
  };
  
  return <Icon name={themeIcons[theme]} variant="default" size={size} />;
}

// Export all icons for direct usage
export {
  Star, Zap, Shield, Users, Settings, Database, Cloud, Code, Palette,
  CheckCircle, Clock, AlertCircle, Trophy, TrendingUp, Heart, MessageCircle,
  Share2, Eye, Download, Upload, Edit, Trash2, Plus, Minus, Search, Filter,
  Sort, Grid, List, Map, Calendar, Mail, Phone, Globe, Lock, Unlock, Key,
  User, UserPlus, UserMinus, Home, Building, Briefcase, CreditCard,
  DollarSign, Target, Award, Gift, Sparkles, Flame, Moon, Sun, Monitor,
  Smartphone, Tablet, Laptop, Camera, Video, Mic, Volume2, VolumeX,
  Play, Pause, Square, SkipBack, SkipForward, RefreshCw, RotateCcw,
  Maximize, Minimize, X, Menu, MoreHorizontal, MoreVertical,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ExternalLink, Link, Copy,
  FileText, File, Folder, FolderOpen, Image, BookOpen, Bookmark, Tag, Hash,
  Bell, BellOff, Inbox, Send, Archive, Flag, PieChart, BarChart3, LineChart,
  Activity, Cpu, HardDrive, Wifi, WifiOff, Signal, Battery, Power, PowerOff
};

// Type exports
export type { IconProps, IconVariant, IconSize };
