'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { Toaster, toast, ToasterProps } from 'react-hot-toast';

type ToastContextType = {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toasterConfig: ToasterProps = {
  position: 'top-center',
  toastOptions: {
    className: '',
    style: {
      background: '#333',
      color: '#fff',
    },
    success: {
      iconTheme: {
        primary: '#10B981',
        secondary: '#333',
      },
    },
    error: {
      iconTheme: {
        primary: '#EF4444',
        secondary: '#333',
      },
    },
  },
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const showSuccess = (message: string) => {
    toast.success(message);
  };

  const showError = (message: string) => {
    toast.error(message);
  };

  return (
    <ToastContext.Provider value={{ showSuccess, showError }}>
      {children}
      <Toaster {...toasterConfig} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
