import { createContext, useContext, useState } from 'react';
import Toast from '../components/Toast.jsx';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ message: '', type: '' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 4000);
  };

  const hideToast = () => setToast({ message: '', type: '' });

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast message={toast.message} type={toast.type} onClose={hideToast} />
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);