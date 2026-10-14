import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, InfoIcon, XCircle } from 'lucide-react';

export const Alert = ({ type = 'info', message, onClose }) => {
  useEffect(() => {
    if (onClose) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [onClose]);

  const bgColor = {
    success: 'bg-green-50',
    error: 'bg-red-50',
    warning: 'bg-yellow-50',
    info: 'bg-blue-50',
  }[type];

  const borderColor = {
    success: 'border-l-4 border-green-500',
    error: 'border-l-4 border-red-500',
    warning: 'border-l-4 border-yellow-500',
    info: 'border-l-4 border-blue-500',
  }[type];

  const textColor = {
    success: 'text-green-700',
    error: 'text-red-700',
    warning: 'text-yellow-700',
    info: 'text-blue-700',
  }[type];

  const Icon = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: InfoIcon,
  }[type];

  return (
    <div className={`${bgColor} ${borderColor} p-4 rounded mb-4 flex items-start space-x-3`}>
      <Icon className={`${textColor} flex-shrink-0 mt-0.5`} size={20} />
      <span className={textColor}>{message}</span>
    </div>
  );
};
