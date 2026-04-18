import { useState, useEffect } from 'react';
import {
  Bell, Check, CheckCheck, Trash2, Mail, MessageSquare,
  AlertCircle, Clock, RefreshCw, HelpCircle, Info,
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { formatDistanceToNow } from '../../utils/helpers';

// ─── Quita IDs tipo "report_1775675911800_551995" de mensajes ya guardados ────
const REPORT_ID_RE = /\breport_\d+_\d+\b/g;
function sanitizeMessage(msg) {
  if (!msg) return '';
  return msg.replace(REPORT_ID_RE, 'tu reporte');
}

// ─── Agrupa notificaciones por fecha ─────────────────────────────────────────
function getDateGroup(timestamp) {
  if (!timestamp) return 'Más antiguas';
  const d = new Date(timestamp);
  const now = new Date();
  const diffDay = Math.floor((now - d) / 86400000);
  if (diffDay === 0) return 'Hoy';
  if (diffDay === 1) return 'Ayer';
  if (diffDay < 7) return 'Esta semana';
  return 'Más antiguas';
}

const GROUP_ORDER = ['Hoy', 'Ayer', 'Esta semana', 'Más antiguas'];

function groupNotifications(notifications) {
  const groups = {};
  for (const n of notifications) {
    const g = getDateGroup(n.timestamp);
    if (!groups[g]) groups[g] = [];
    groups[g].push(n);
  }
  return GROUP_ORDER.filter((g) => groups[g]).map((g) => ({ label: g, items: groups[g] }));
}

// ─── Icono según tipo ─────────────────────────────────────────────────────────
function NotifIcon({ type }) {
  if (type === 'contact') return <MessageSquare className="h-4 w-4 text-blue-500" />;
  if (type === 'update')  return <AlertCircle   className="h-4 w-4 text-emerald-500" />;
  if (type === 'message') return <Mail          className="h-4 w-4 text-violet-500" />;
  return <Bell className="h-4 w-4 text-muted-foreground" />;
}

// ─── Fondo según tipo ─────────────────────────────────────────────────────────
function iconBg(type) {
  if (type === 'contact') return 'bg-blue-100   dark:bg-blue-900/30';
  if (type === 'update')  return 'bg-emerald-100 dark:bg-emerald-900/30';
  if (type === 'message') return 'bg-violet-100  dark:bg-violet-900/30';
  return 'bg-muted';
}

// ─── Tarjeta de una notificación ──────────────────────────────────────────────
function NotifCard({ notification, onRead, onDelete }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={`
        flex gap-3 p-4 rounded-xl border transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        ${!notification.read
          ? 'border-l-4 border-l-blue-400 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-700 shadow-sm'
          : 'border-border bg-card'
        }
      `}
    >
      {/* Icono */}
      <div className={`shrink-0 mt-0.5 p-2 rounded-lg ${iconBg(notification.type)}`}>
        <NotifIcon type={notification.type} />
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <span className={`text-sm font-semibold leading-snug ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
            {notification.title}
          </span>
          {!notification.read && (
            <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-blue-500 mt-1.5" />
          )}
        </div>

        <p className="text-sm text-muted-foreground leading-snug mb-2">
          {sanitizeMessage(notification.message)}
        </p>

        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(notification.timestamp)}
          </span>

          <div className="flex items-center gap-1">
            {!notification.read && (
              <button
                onClick={() => onRead(notification.id)}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
              >
                <Check className="h-3 w-3" /> Leída
              </button>
            )}
            <button
              onClick={() => onDelete(notification.id)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-600 px-2 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tooltip de ayuda compacto ────────────────────────────────────────────────
function HelpTooltip() {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
        aria-label="¿Cuándo recibiré notificaciones?"
      >
        <HelpCircle className="h-4 w-4" />
      </button>
      {open && (
        <span className="absolute bottom-full right-0 z-30 mb-2 w-64 rounded-xl border bg-popover px-4 py-3 text-xs text-popover-foreground shadow-lg">
          <p className="font-semibold mb-1.5">Recibirás notificaciones cuando:</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Alguien contacte tu reporte de mascota</li>
            <li>• Tu reporte sea verificado por el equipo</li>
            <li>• Haya actualizaciones importantes del sistema</li>
          </ul>
        </span>
      )}
    </span>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, refreshNotifications } =
    useNotifications();

  const groups = groupNotifications(notifications);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">Notificaciones</h1>
                <HelpTooltip />
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {unreadCount > 0
                  ? `${unreadCount} sin leer`
                  : 'Todo al día'}
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={refreshNotifications} variant="outline" size="sm" className="gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" /> Actualizar
              </Button>
              {unreadCount > 0 && (
                <Button onClick={markAllAsRead} variant="outline" size="sm" className="gap-1.5">
                  <CheckCheck className="h-3.5 w-3.5" /> Marcar todas
                </Button>
              )}
            </div>
          </div>

          {/* Lista agrupada */}
          {notifications.length > 0 ? (
            <div className="space-y-6">
              {groups.map(({ label, items }) => (
                <section key={label}>
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-1">
                    {label}
                  </h2>
                  <div className="space-y-2">
                    {items.map((n) => (
                      <NotifCard
                        key={n.id}
                        notification={n}
                        onRead={markAsRead}
                        onDelete={removeNotification}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            /* Estado vacío — incluye info de ayuda */
            <Card className="border-dashed border-2">
              <CardContent className="py-14 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Bell className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold mb-1">Sin notificaciones</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Cuando haya actividad en tus reportes, aparecerá aquí.
                </p>

                {/* Info compacta solo en estado vacío */}
                <div className="mx-auto max-w-xs rounded-xl border bg-muted/50 px-4 py-3 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs font-medium text-muted-foreground">Recibirás avisos cuando</span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Alguien contacte tu reporte</li>
                    <li>• Tu reporte sea verificado</li>
                    <li>• Haya actualizaciones del sistema</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
