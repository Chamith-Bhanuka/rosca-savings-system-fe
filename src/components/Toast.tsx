import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose: () => void;
  duration?: number;
  isDark?: boolean;
}

const Toast: React.FC<ToastProps> = ({
  type,
  message,
  onClose,
  duration = 5000,
  isDark = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto-close after duration
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    const baseStyles =
      'flex items-start gap-3 p-4 rounded-lg shadow-lg border backdrop-blur-sm min-w-[300px] max-w-md';

    if (isDark) {
      switch (type) {
        case 'success':
          return `${baseStyles} bg-green-900/80 border-green-500/50 text-green-200`;
        case 'error':
          return `${baseStyles} bg-red-900/80 border-red-500/50 text-red-200`;
        case 'warning':
          return `${baseStyles} bg-yellow-900/80 border-yellow-500/50 text-yellow-200`;
        case 'info':
          return `${baseStyles} bg-blue-900/80 border-blue-500/50 text-blue-200`;
      }
    } else {
      switch (type) {
        case 'success':
          return `${baseStyles} bg-green-50 border-green-300 text-green-800`;
        case 'error':
          return `${baseStyles} bg-red-50 border-red-300 text-red-800`;
        case 'warning':
          return `${baseStyles} bg-yellow-50 border-yellow-300 text-yellow-800`;
        case 'info':
          return `${baseStyles} bg-blue-50 border-blue-300 text-blue-800`;
      }
    }
  };

  const getIconColor = () => {
    if (isDark) {
      switch (type) {
        case 'success':
          return 'text-green-400';
        case 'error':
          return 'text-red-400';
        case 'warning':
          return 'text-yellow-400';
        case 'info':
          return 'text-blue-400';
      }
    } else {
      switch (type) {
        case 'success':
          return 'text-green-600';
        case 'error':
          return 'text-red-600';
        case 'warning':
          return 'text-yellow-600';
        case 'info':
          return 'text-blue-600';
      }
    }
  };

  return (
    <div
      className={`${getStyles()} transition-all duration-300 ${
        isVisible && !isExiting
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
      }`}
      role="alert"
    >
      {/* Icon */}
      <div className={`flex-shrink-0 ${getIconColor()}`}>{getIcon()}</div>

      {/* Message */}
      <div className="flex-1 text-sm font-medium">{message}</div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className={`flex-shrink-0 rounded-lg p-1 transition-colors ${
          isDark
            ? 'hover:bg-white/10 text-white/70 hover:text-white'
            : 'hover:bg-black/5 text-gray-500 hover:text-gray-700'
        }`}
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress Bar */}
      <div
        className={`absolute bottom-0 left-0 h-1 rounded-b-lg transition-all ${
          type === 'success'
            ? isDark
              ? 'bg-green-500'
              : 'bg-green-600'
            : type === 'error'
              ? isDark
                ? 'bg-red-500'
                : 'bg-red-600'
              : type === 'warning'
                ? isDark
                  ? 'bg-yellow-500'
                  : 'bg-yellow-600'
                : isDark
                  ? 'bg-blue-500'
                  : 'bg-blue-600'
        }`}
        style={{
          width: isExiting ? '0%' : '100%',
          transition: `width ${duration}ms linear`,
        }}
      />
    </div>
  );
};

export default Toast;
