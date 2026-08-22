import React, { createContext, useContext, useState, useCallback } from "react";
import { IconCheckCircle, IconAlertCircle, IconSparkles, IconX } from "./Icons";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-item toast-${toast.type}`} role="status">
            <div className="toast-icon">
              {toast.type === "success" && <IconCheckCircle className="w-5 h-5" />}
              {toast.type === "error" && <IconAlertCircle className="w-5 h-5" />}
              {toast.type === "info" && <IconSparkles className="w-5 h-5" />}
            </div>
            <div className="toast-message">{toast.message}</div>
            <button className="toast-close" onClick={() => removeToast(toast.id)} aria-label="Close notification">
              <IconX className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      addToast: (msg) => console.log(msg),
      removeToast: () => {}
    };
  }
  return context;
}
