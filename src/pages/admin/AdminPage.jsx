import { useEffect, useState } from 'react';
import { Trash2, AlertCircle, RefreshCw, Users, FileText, Search } from 'lucide-react';
import { useAlert } from '../../context/AlertContext';
import { getReports } from '../../services/reportService';
import { adminDeleteReport } from '../../services/reportService';
import { adminGetAllUsers, adminDeleteUser } from '../../services/userService';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';

const typeLabels = { lost: 'Perdido', found: 'Encontrado' };
const statusLabels = { active: 'Activo', resolved: 'Resuelto', inactive: 'Inactivo' };

function ConfirmModal({ open, title, description, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-background border shadow-xl p-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-base font-semibold mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground mb-6">{description}</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>Cancelar</Button>
          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={onConfirm}>
            Sí, eliminar
          </Button>
        </div>
      </div>
    </div>
  );
}

function ReportsTab() {
  const { addAlert } = useAlert();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [busyId, setBusyId] = useState('');
  const [pending, setPending] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getReports({ limit: 100 });
      const data = Array.isArray(res) ? res : res?.data ?? [];
      setReports(data);
    } catch (err) {
      setError(err?.message || 'No fue posible cargar los reportes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filtered = reports.filter((r) => {
    const q = query.toLowerCase();
    return !q || r.species?.toLowerCase().includes(q) || r.breed?.toLowerCase().includes(q) || r.id?.includes(q);
  });

  const handleDelete = async () => {
    const id = pending;
    setPending(null);
    setBusyId(id);
    try {
      await adminDeleteReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
      addAlert({ type: 'success', message: 'Reporte eliminado.' });
    } catch (err) {
      addAlert({ type: 'error', message: err?.message || 'No fue posible eliminar el reporte.' });
    } finally {
      setBusyId('');
    }
  };

  return (
    <>
      <ConfirmModal
        open={!!pending}
        title="Eliminar reporte"
        description="Esta acción no se puede deshacer. El reporte dejará de aparecer públicamente."
        onConfirm={handleDelete}
        onCancel={() => setPending(null)}
      />
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar por especie, raza o ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={load} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Actualizar
        </Button>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground py-8">Cargando reportes...</p>
      ) : error ? (
        <div className="flex items-center gap-2 text-red-600 py-8">
          <AlertCircle className="h-5 w-5" /> {error}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No se encontraron reportes.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">ID</th>
                <th className="text-left p-3 font-medium">Especie</th>
                <th className="text-left p-3 font-medium">Raza</th>
                <th className="text-left p-3 font-medium">Tipo</th>
                <th className="text-left p-3 font-medium">Estado</th>
                <th className="text-left p-3 font-medium">Fecha</th>
                <th className="text-right p-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-mono text-xs text-muted-foreground">{r.id?.slice(0, 8)}…</td>
                  <td className="p-3 capitalize">{r.species || '—'}</td>
                  <td className="p-3">{r.breed || '—'}</td>
                  <td className="p-3">
                    <Badge variant={r.type === 'lost' ? 'destructive' : 'default'}>
                      {typeLabels[r.type] || r.type}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge variant="outline">{statusLabels[r.status] || r.status}</Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString('es-ES') : '—'}
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={busyId === r.id}
                      onClick={() => setPending(r.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

function UsersTab() {
  const { addAlert } = useAlert();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [busyId, setBusyId] = useState('');
  const [pending, setPending] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminGetAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err?.message || 'No fue posible cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filtered = users.filter((u) => {
    const q = query.toLowerCase();
    return !q || u.email?.toLowerCase().includes(q) || u.username?.toLowerCase().includes(q) || u.fullName?.toLowerCase().includes(q);
  });

  const handleDelete = async () => {
    const id = pending;
    setPending(null);
    setBusyId(id);
    try {
      await adminDeleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      addAlert({ type: 'success', message: 'Usuario desactivado.' });
    } catch (err) {
      addAlert({ type: 'error', message: err?.message || 'No fue posible desactivar el usuario.' });
    } finally {
      setBusyId('');
    }
  };

  return (
    <>
      <ConfirmModal
        open={!!pending}
        title="Desactivar usuario"
        description="El usuario dejará de poder acceder a la plataforma. Esta acción puede revertirse manualmente en base de datos."
        onConfirm={handleDelete}
        onCancel={() => setPending(null)}
      />
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar por email, username o nombre..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={load} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Actualizar
        </Button>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground py-8">Cargando usuarios...</p>
      ) : error ? (
        <div className="flex items-center gap-2 text-red-600 py-8">
          <AlertCircle className="h-5 w-5" /> {error}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No se encontraron usuarios.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Nombre</th>
                <th className="text-left p-3 font-medium">Username</th>
                <th className="text-left p-3 font-medium">Email</th>
                <th className="text-left p-3 font-medium">Rol</th>
                <th className="text-left p-3 font-medium">Estado</th>
                <th className="text-right p-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t hover:bg-muted/30 transition-colors">
                  <td className="p-3">{u.fullName || `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || '—'}</td>
                  <td className="p-3 text-muted-foreground">@{u.username}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <Badge variant={u.role === 'admin' ? 'default' : 'outline'}>{u.role || 'user'}</Badge>
                  </td>
                  <td className="p-3">
                    <Badge variant={u.isActive ? 'default' : 'secondary'}>
                      {u.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={busyId === u.id || u.role === 'admin'}
                      onClick={() => setPending(u.id)}
                      title={u.role === 'admin' ? 'No se puede desactivar a un admin' : 'Desactivar usuario'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

export default function AdminPage() {
  const [tab, setTab] = useState('reports');

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Panel de Administración</h1>
            <p className="mt-1 text-muted-foreground">Gestión de reportes y usuarios de la plataforma.</p>
          </div>

          <div className="flex gap-2 mb-6">
            <Button
              variant={tab === 'reports' ? 'default' : 'outline'}
              onClick={() => setTab('reports')}
              className="gap-2"
            >
              <FileText className="h-4 w-4" /> Reportes
            </Button>
            <Button
              variant={tab === 'users' ? 'default' : 'outline'}
              onClick={() => setTab('users')}
              className="gap-2"
            >
              <Users className="h-4 w-4" /> Usuarios
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{tab === 'reports' ? 'Todos los reportes' : 'Todos los usuarios'}</CardTitle>
            </CardHeader>
            <CardContent>
              {tab === 'reports' ? <ReportsTab /> : <UsersTab />}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
