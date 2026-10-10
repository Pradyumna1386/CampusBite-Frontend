import { createContext, useContext, useRef, useState } from 'react';

/*
 * Single, reusable toast notification for the app.
 *
 * - showToast(message) displays one compact toast in the top-right corner.
 * - Showing a message while one is already visible REPLACES it instead of
 *   stacking, so rapid add-to-cart clicks stay clean.
 * - The toast auto-dismisses after ~2 seconds then plays its fade-out.
 */
const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null); // {id, message}
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef(null);
  const exitTimer = useRef(null);

  function showToast(message) {
    clearTimeout(hideTimer.current);
    clearTimeout(exitTimer.current);
    setToast({ id: Date.now(), message });
    setVisible(true);
    hideTimer.current = setTimeout(() => {
      setVisible(false);
      exitTimer.current = setTimeout(() => setToast(null), 250);
    }, 2000);
  }

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && (
        <div key={toast.id} className={`toast ${visible ? 'toast-visible' : ''}`} role="status">
          <span className="toast-icon">✓</span>
          <span className="toast-text">{toast.message}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);