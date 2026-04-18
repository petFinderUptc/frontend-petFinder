import { useEffect, useState, useCallback } from 'react';
import {
  Users, ClipboardList, Trash2, RefreshCw, ShieldCheck,
  AlertCircle, Search, UserX,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAlert } from '../../context/AlertContext';
import apiClient from '../../services/api/apiClient';
import { REPORT_ENDPOINTS, ADMIN_ENDPOINTS } from '../../constants/apiEndpoints';

const SPECIES_LABEL = { dog: 'Perro', cat: 'Gato', bird: 'Ave', rabbit: 'Conejo', other: 'Otro' };
const TYPE_LABEL    = { lost: 'Perdido', found: 'Encontrado' };
const STATUS_LABEL  = { active: 'Activo', resolved: 'Resuelto', inactive: 'Inactivo' };
const STATUS_VARIANT = { active: 'default', resolved: 'secondary', inactive: 'outline' };

// ─── Skeleton genérico ────────────────────────────────────────────────────────
function Skeleton({ className }) {
  return <div className={`rounded bg-muted animate-pulse ${className}`} />;
}

// ─── Confirmación de borrado ──────────────────────────────────────────────────
function ConfirmModal({ open, title, description, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-background border shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
            <Trash2 className="h-5 w-5 text-red-600" />
          </div>
          <h2 className="text-base font-semibold">{title}</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6">{description}</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>Cancelar</Button>
          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={onConfirm}>
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Reportes ────────────────────────────────────────────────────────────
function ReportsTab() {
  const { addAlert } = useAlert();
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [busyId, setBusyId] = useState('');
  const [search, setSearch] = useState('');

  const load = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.get(REPORT_ENDPOINTS.ADMIN_ALL, { params: { page, limit: 20 } });
      setReports(res.data?.data ?? []);
      setPagination(res.data?.pagination ?? { page: 1, totalPages: 1, total: 0 });
    } catch {
      addAlert({ type: 'error', message: 'No se pudieron cargar los reportes.' });
    } finally {
      setLoading(false);
    }
  }, [addAlert]);

  useEffect(() => { load(1); }, [load]);

  const confirmDelete = async () => {
    const id = pendingDelete;
    setPendingDelete(null);
    setBusyId(id);
    try {
      await apiClient.delete(REPORT_ENDPOINTS.ADMIN_DELETE(id));
      addAlert({ type: 'success', message: 'Reporte eliminado.' });
      load(pagination.page);
    } catch {
      addAlert({ type: 'error', message: 'No se pudo eliminar el reporte.' });
    } finally {
      setBusyId('');
    }
  };

  const filtered = search.trim()
    ? reports.filter(
        (r) =>
          r.description?.toLowerCase().includes(search.toLowerCase()) ||
          r.breed?.toLowerCase().includes(search.toLowerCase()) ||
          r.id?.toLowerCase().includes(search.toLowerCase()),
      )
    : reports;

  return (
    <>
      <ConfirmModal
        open={!!pendingDelete}
        title="Eliminar reporte"
        description="Esta acción no se puede deshacer. El reporte quedará inactivo permanentemente."
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por descripción, raza o ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => load(pagination.page)} className="gap-1.5 shrink-0">
          <RefreshCw className="h-3.5 w-3.5" /> Actualizar
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          <ClipboardList className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No hay reportes.</p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Especie / Raza</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Tipo</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Estado</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Fecha</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium">{SPECIES_LABEL[r.species] ?? r.species}</p>
                      <p className="text-xs text-muted-foreground">{r.breed || '—'}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge variant={r.type === 'lost' ? 'destructive' : 'default'}>
                        {TYPE_LABEL[r.type] ?? r.type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_VARIANT[r.status] ?? 'outline'}>
                        {STATUS_LABEL[r.status] ?? r.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                      {new Date(r.createdAt).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={busyId === r.id}
                        onClick={() => setPendingDelete(r.id)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <Button
                variant="outline" size="sm"
                disabled={pagination.page <= 1}
                onClick={() => load(pagination.page - 1)}
              >Anterior</Button>
              <span className="text-sm text-muted-foreground">
                {pagination.page} / {pagination.totalPages}
              </span>
              <Button
                variant="outline" size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => load(pagination.page + 1)}
              >Siguiente</Button>
            </div>
          )}
        </>
      )}
    </>
  );
}

// ─── Tab: Usuarios ────────────────────────────────────────────────────────────
function UsersTab() {
  const { addAlert } = useAlert();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [busyId, setBusyId] = useState('');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(ADMIN_ENDPOINTS.GET_ALL_USERS);
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch {
      addAlert({ type: 'error', message: 'No se pudieron cargar los usuarios.' });
    } finally {
      setLoading(false);
    }
  }, [addAlert]);

  useEffect(() => { load(); }, [load]);

  const confirmDelete = async () => {
    const id = pendingDelete;
    setPendingDelete(null);
    setBusyId(id);
    try {
      await apiClient.delete(ADMIN_ENDPOINTS.DELETE_USER(id));
      addAlert({ type: 'success', message: 'Usuario desactivado.' });
      load();
    } catch {
      addAlert({ type: 'error', message: 'No se pudo eliminar el usuario.' });
    } finally {
      setBusyId('');
    }
  };

  const filtered = search.trim()
    ? users.filter(
        (u) =>
          u.email?.toLowerCase().includes(search.toLowerCase()) ||
          u.username?.toLowerCase().includes(search.toLowerCase()) ||
          `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()),
      )
    : users;

  return (
    <>
      <ConfirmModal
        open={!!pendingDelete}
        title="Desactivar usuario"
        description="El usuario perderá acceso a la plataforma. Sus reportes serán desactivados."
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button variant="outline" size="sm" onClick={load} className="gap-1.5 shrink-0">
          <RefreshCw className="h-3.5 w-3.5" /> Actualizar
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          <Users className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No hay usuarios.</p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Usuario</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Rol</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{u.firstName} {u.lastName}</p>
                    <p className="text-xs text-muted-foreground">@{u.username}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{u.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant={u.role === 'admin' ? 'default' : 'outline'}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${u.isActive ? 'text-emerald-600' : 'text-red-500'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${u.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      {u.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.role !== 'admin' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={busyId === u.id}
                        onClick={() => setPendingDelete(u.id)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab] = useState('reports');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-900 dark:via-slate-950 dark:to-black py-10 border-b">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/40">
              <ShieldCheck className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">Panel de Administración</h1>
          </div>
          <p className="text-muted-foreground text-sm ml-14">
            Gestión de reportes y usuarios de la plataforma
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl py-8">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit mb-6">
          {[
            { key: 'reports', label: 'Reportes', icon: ClipboardList },
            { key: 'users',   label: 'Usuarios', icon: Users },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === key
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {tab === 'reports' ? 'Todos los reportes' : 'Todos los usuarios'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tab === 'reports' ? <ReportsTab /> : <UsersTab />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
