import React, { useEffect, useState } from 'react';
import { X, Bell } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store.ts';

interface NotificationToastProps {
  id: string;
  title: string;
  message: string;
  onClose: (id: string) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  id,
  title,
  message,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useSelector((state: RootState) => state.theme.value);
  const isDark = theme === 'dark';

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));

    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 400);
  };

  return (
    <div
      className={`
        pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-xl ring-1 
        transition-all duration-500 ease-in-out transform mb-3
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${
          isDark
            ? 'bg-[#1f1f1f]/90 text-gray-200 ring-[#d4a574]/30 shadow-[#d4a574]/10'
            : 'bg-white/95 text-gray-900 ring-[#b8894d]/20 shadow-lg'
        }
        backdrop-blur-md
      `}
      role="alert"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Bell
              className={`h-6 w-6 ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
            />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p
              className={`text-sm font-semibold ${isDark ? 'text-[#d4a574]' : 'text-[#b8894d]'}`}
            >
              {title}
            </p>
            <p
              className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            >
              {message}
            </p>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className={`inline-flex rounded-md p-1 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-[#d4a574]`}
              onClick={handleClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`h-0.5 w-full ${isDark ? 'bg-[#d4a574]' : 'bg-[#b8894d]'}`}
        style={{
          animation: 'shrink 5s linear forwards',
          transformOrigin: 'left',
        }}
      />
      <style>{`
        @keyframes shrink {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
};

export default NotificationToast;
