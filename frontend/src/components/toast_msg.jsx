import { useEffect } from 'react';

// toast msg
export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className={`toast-container ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
        <span>{toast.message}</span>
      <button className="toast-close" onClick={onClose}>✕</button>
    </div>
  );
}
