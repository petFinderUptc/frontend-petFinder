import { useEffect, useState } from 'react';
import { Sparkles, WifiOff } from 'lucide-react';
import { getAiStatus } from '../services/reportService';

export function AiStatusBadge() {
  const [status, setStatus] = useState(null); // null = loading, true = available, false = unavailable

  useEffect(() => {
    getAiStatus()
      .then((res) => setStatus(res?.available === true))
      .catch(() => setStatus(false));
  }, []);

  if (status === null) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-40 flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium shadow-lg border backdrop-blur-sm transition-all select-none ${
        status
          ? 'bg-green-50/90 border-green-300 text-green-700'
          : 'bg-red-50/90 border-red-300 text-red-600'
      }`}
      title={status ? 'Búsqueda semántica IA activa (Gemini)' : 'Búsqueda semántica IA no disponible'}
    >
      <span
        className={`h-2 w-2 rounded-full flex-shrink-0 ${
          status ? 'bg-green-500 animate-pulse' : 'bg-red-500'
        }`}
      />
      {status ? (
        <Sparkles className="h-3 w-3" />
      ) : (
        <WifiOff className="h-3 w-3" />
      )}
      <span>Búsqueda Semántica IA</span>
    </div>
  );
}
