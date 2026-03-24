import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AlertContext = createContext(undefined);

const variantClasses = {
  success: 'border-green-200 bg-green-50 text-green-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  info: 'border-sky-200 bg-sky-50 text-sky-800',
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAlert = () => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error('useAlert must be used within AlertProvider');
  }

  return context;
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const removeAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addAlert = useCallback((payload) => {
    const id = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const next = {
      id,
      type: payload?.type || 'info',
      message: payload?.message || 'Operacion completada.',
      durationMs: Number(payload?.durationMs || 4000),
    };

    setAlerts((prev) => [next, ...prev].slice(0, 5));

    window.setTimeout(() => {
      removeAlert(id);
    }, next.durationMs);
  }, [removeAlert]);

  useEffect(() => {
    const onAlert = (event) => {
      addAlert(event.detail || {});
    };

    window.addEventListener('petfinder:alert', onAlert);
    return () => window.removeEventListener('petfinder:alert', onAlert);
  }, [addAlert]);

  const value = useMemo(() => ({ addAlert, removeAlert }), [addAlert, removeAlert]);

  return (
    <AlertContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[70] flex w-[min(92vw,380px)] flex-col gap-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-lg border px-4 py-3 shadow-md ${variantClasses[alert.type] || variantClasses.info}`}
            role="status"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium leading-5">{alert.message}</p>
              <button
                type="button"
                onClick={() => removeAlert(alert.id)}
                className="text-xs font-semibold opacity-70 transition hover:opacity-100"
              >
                Cerrar
              </button>
            </div>
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
};

