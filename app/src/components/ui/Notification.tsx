'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  X, 
  XCircle,
  Loader2
} from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'loading';

interface NotificationProps {
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function Notification({ 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose,
  action 
}: NotificationProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    if (duration > 0 && type !== 'loading') {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [duration, onClose, type]);

  const getNotificationConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-ece-success/20',
          borderColor: 'border-ece-success/40',
          iconColor: 'text-ece-success',
          titleColor: 'text-ece-light'
        };
      case 'error':
        return {
          icon: XCircle,
          bgColor: 'bg-ece-error/20',
          borderColor: 'border-ece-error/40',
          iconColor: 'text-ece-error',
          titleColor: 'text-ece-light'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-ece-warning/20',
          borderColor: 'border-ece-warning/40',
          iconColor: 'text-ece-warning',
          titleColor: 'text-ece-light'
        };
      case 'info':
        return {
          icon: Info,
          bgColor: 'bg-ece-info/20',
          borderColor: 'border-ece-info/40',
          iconColor: 'text-ece-info',
          titleColor: 'text-ece-light'
        };
      case 'loading':
        return {
          icon: Loader2,
          bgColor: 'bg-ece-accent/20',
          borderColor: 'border-ece-accent/40',
          iconColor: 'text-ece-accent',
          titleColor: 'text-ece-light'
        };
      default:
        return {
          icon: Info,
          bgColor: 'bg-ece-muted/20',
          borderColor: 'border-ece-muted/40',
          iconColor: 'text-ece-muted',
          titleColor: 'text-ece-light'
        };
    }
  };

  const config = getNotificationConfig();
  const IconComponent = config.icon;

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        relative max-w-sm w-full ${config.bgColor} backdrop-blur-lg 
        border ${config.borderColor} rounded-lg shadow-lg p-4
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${config.iconColor}`}>
          <IconComponent 
            className={`w-5 h-5 ${type === 'loading' ? 'animate-spin' : ''}`} 
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-medium ${config.titleColor}`}>
            {title}
          </h4>
          {message && (
            <p className="mt-1 text-sm text-ece-muted">
              {message}
            </p>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className="mt-2 text-sm font-medium text-ece-accent hover:text-ece-error transition-colors"
            >
              {action.label}
            </button>
          )}
        </div>
        
        {onClose && type !== 'loading' && (
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onClose?.(), 300);
            }}
            className="flex-shrink-0 text-ece-muted hover:text-ece-light transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Progress bar for timed notifications */}
      {duration > 0 && type !== 'loading' && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-ece-accent/50 rounded-b-lg"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: "linear" }}
        />
      )}
    </motion.div>
  );
}

// Notification Container
interface NotificationContainerProps {
  notifications: (NotificationProps & { id: string })[];
  onRemove: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export function NotificationContainer({ 
  notifications, 
  onRemove, 
  position = 'top-right' 
}: NotificationContainerProps) {
  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-50 space-y-3`}>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={() => onRemove(notification.id)}
        />
      ))}
    </div>
  );
}

// Toast Hook
export function useNotifications() {
  const [notifications, setNotifications] = React.useState<(NotificationProps & { id: string })[]>([]);

  const addNotification = React.useCallback((notification: Omit<NotificationProps, 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { ...notification, id }]);
    return id;
  }, []);

  const removeNotification = React.useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = React.useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const success = React.useCallback((title: string, message?: string) => {
    return addNotification({ type: 'success', title, message });
  }, [addNotification]);

  const error = React.useCallback((title: string, message?: string) => {
    return addNotification({ type: 'error', title, message });
  }, [addNotification]);

  const warning = React.useCallback((title: string, message?: string) => {
    return addNotification({ type: 'warning', title, message });
  }, [addNotification]);

  const info = React.useCallback((title: string, message?: string) => {
    return addNotification({ type: 'info', title, message });
  }, [addNotification]);

  const loading = React.useCallback((title: string, message?: string) => {
    return addNotification({ type: 'loading', title, message, duration: 0 });
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
    loading
  };
}

// Toast Provider Context
const NotificationContext = React.createContext<ReturnType<typeof useNotifications> | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const notifications = useNotifications();

  return (
    <NotificationContext.Provider value={notifications}>
      {children}
      <NotificationContainer 
        notifications={notifications.notifications}
        onRemove={notifications.removeNotification}
        position="top-right"
      />
    </NotificationContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useToast must be used within a NotificationProvider');
  }
  return context;
}

export default Notification;
