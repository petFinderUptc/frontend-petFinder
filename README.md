# PetFinder — Frontend

Aplicación web para el reencuentro de mascotas perdidas en Tunja y sus alrededores. Permite a cualquier persona publicar reportes de mascotas perdidas o encontradas, buscarlos con filtros avanzados e incluso por descripción en lenguaje natural gracias a búsqueda semántica con IA.

Desarrollada como proyecto para la asignatura Trabajo de Campo - Universidad Pedagógica y Tecnológica de Colombia (UPTC).

---

## Stack

- **React 18** + **Vite** — interfaz y bundler
- **React Router v6** — enrutamiento del lado del cliente
- **Tailwind CSS** + **shadcn/ui** — estilos y componentes base
- **Framer Motion** — animaciones
- **Axios** — cliente HTTP con interceptores para JWT
- **Leaflet** — mapas interactivos
- **Recharts** — gráficas de estadísticas
- **Lucide React** — iconografía

---

## Estructura

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/              # Primitivos: Button, Card, Input, Badge, Alert
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── FilterPanel.jsx
│   ├── LocationPicker.jsx
│   ├── PetMap.jsx
│   ├── SearchResultCard.jsx
│   ├── MatchesModal.jsx
│   ├── ProfileDropdown.jsx
│   ├── ReportCardItem.jsx
│   ├── StatsSection.jsx
│   ├── ProtectedRoute.jsx
│   └── AdminRoute.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── StatsPage.jsx
│   ├── auth/            # Login, Register, ForgotPassword, ResetPassword
│   ├── pet/             # SearchPage, PetDetailPage, PublishReportPage, EditReportPage
│   ├── user/            # DashboardPage, ProfilePage, MyReportsPage, NotificationsPage, SettingsPage
│   └── admin/           # AdminPage
├── context/             # AuthContext, NotificationContext, ThemeContext, AlertContext
├── hooks/               # useApi, useDebounce, useForm, useLocalStorage, useSignedUrl, useToggle
├── services/
│   ├── api/             # apiClient.js — instancia Axios con interceptores
│   ├── authService.js
│   ├── reportService.js
│   ├── locationService.js
│   ├── notificationService.js
│   ├── profileService.js
│   └── userService.js
├── utils/               # validation, helpers, postAdapter, userAdapter, storage, alerts
├── constants/           # routes.js, apiEndpoints.js, appConfig.js
├── layouts/             # MainLayout.jsx
├── styles/              # theme.css, fonts.css, leaflet.css, tailwind.css
└── lib/                 # utils.js (cn helper de Tailwind)
```

---

## Requisitos

- Node.js 18+
- Backend corriendo en `http://localhost:3000` (ver [backend-petFinder](../backend-petFinder))

---

## Inicio rápido

```bash
# Instalar dependencias
npm install

# Configurar entorno
cp .env.example .env

# Levantar servidor de desarrollo
npm run dev
```

La app queda disponible en `http://localhost:5173`.

---

## Variables de entorno

| Variable | Descripción | Por defecto |
|---|---|---|
| `VITE_API_BASE_URL` | URL base del backend | `http://localhost:3000/api/v1` |
| `VITE_ENVIRONMENT` | Entorno de ejecución | `development` |
| `VITE_OFFLINE_MODE` | Desactiva llamadas al backend | `false` |

---

## Scripts

```bash
npm run dev      # Desarrollo con hot-reload
npm run build    # Build de producción
npm run preview  # Vista previa del build
npm run lint     # ESLint
```

---

## Rutas principales

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | Público | Página de inicio |
| `/search` | Público | Búsqueda y filtrado de reportes |
| `/pet/:id` | Público | Detalle de un reporte |
| `/stats` | Público | Estadísticas de la comunidad |
| `/login` | Público | Inicio de sesión |
| `/register` | Público | Registro |
| `/dashboard` | Autenticado | Resumen de actividad del usuario |
| `/my-reports` | Autenticado | Reportes propios |
| `/publish` | Autenticado | Crear nuevo reporte |
| `/profile` | Autenticado | Editar perfil |
| `/notifications` | Autenticado | Centro de notificaciones |
| `/settings` | Autenticado | Configuración de la cuenta |
| `/admin` | Admin | Panel de administración |

---

## Producción

El frontend está desplegado en Azure Static Web Apps:
[kind-water-085d48310.2.azurestaticapps.net](https://kind-water-085d48310.2.azurestaticapps.net)
