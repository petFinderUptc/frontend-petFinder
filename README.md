# PetFinder - Frontend

Plataforma web para el reencuentro de mascotas perdidas en Tunja y alrededores. Aplicación construida con React que permite publicar y buscar reportes de mascotas extraviadas o encontradas.

## Descripción

PetFinder es una aplicación web profesional que conecta a personas que han perdido o encontrado mascotas. Permite publicar reportes con fotos, descripciones y ubicaciones, además de buscar y filtrar mascotas reportadas en la zona.

### Características principales

- **Autenticación JWT**: Sistema completo de login y registro con tokens
- **Mapas interactivos**: Visualización de ubicaciones con Leaflet
- **Búsqueda avanzada**: Filtros por tipo, raza, zona y estado
- **Diseño responsive**: Optimizado para móviles y desktop
- **Interfaz moderna**: Componentes con Tailwind CSS
- **Alto rendimiento**: Construido con Vite

## Stack Tecnológico

| Tecnología | Propósito |
|------------|-----------|
| **React 18** | Biblioteca de UI moderna y eficiente |
| **Vite** | Build tool ultra-rápido y dev server |
| **React Router v6** | Enrutamiento del lado del cliente |
| **Axios** | Cliente HTTP con interceptores |
| **Tailwind CSS** | Framework CSS utility-first |
| **Leaflet** | Mapas interactivos |
| **Lucide React** | Iconos modernos |
| **Context API** | Gestión de estado global |

## Estructura del Proyecto

```
frontend-petFinder/
├── public/                  # Archivos estáticos
│   └── LOGOPNG.png         # Logo de la aplicación
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── ui/            # Componentes UI base (Button, Input, Card, etc.)
│   │   ├── Header.jsx     # Barra de navegación
│   │   ├── Footer.jsx     # Pie de página
│   │   ├── PetCard.jsx    # Tarjeta de mascota
│   │   ├── PetMap.jsx     # Mapa interactivo
│   │   └── FilterPanel.jsx # Panel de filtros
│   ├── pages/             # Páginas de la aplicación
│   │   ├── HomePage.jsx           # Página principal
│   │   ├── auth/                  # Páginas de autenticación
│   │   │   ├── LoginPage.jsx     # Inicio de sesión
│   │   │   └── RegisterPage.jsx  # Registro
│   │   ├── pet/                   # Páginas de mascotas
│   │   │   ├── SearchPage.jsx           # Búsqueda
│   │   │   └── PublishReportPage.jsx    # Publicar reporte
│   │   └── user/                  # Páginas de usuario
│   │       └── DashboardPage.jsx # Panel de control
│   ├── context/           # Context API
│   │   └── AuthContext.jsx       # Estado de autenticación
│   ├── services/          # Servicios API
│   │   ├── api/
│   │   │   └── apiClient.js      # Configuración de Axios
│   │   ├── authService.js        # Autenticación
│   │   ├── petService.js         # Operaciones de mascotas
│   │   └── userService.js        # Operaciones de usuario
│   ├── hooks/             # Custom hooks
│   │   ├── useForm.js            # Manejo de formularios
│   │   ├── useApi.js             # Llamadas API
│   │   ├── useDebounce.js        # Debouncing
│   │   ├── useLocalStorage.js    # Estado persistente
│   │   └── useToggle.js          # Toggle booleano
│   ├── utils/             # Utilidades
│   │   ├── validation.js         # Validaciones
│   │   ├── helpers.js            # Funciones auxiliares
│   │   └── storage.js            # Wrapper de localStorage
│   ├── constants/         # Constantes
│   │   ├── apiEndpoints.js       # URLs de API
│   │   ├── routes.js             # Rutas de la app
│   │   └── appConfig.js          # Configuración
  ├── layouts/           # Layouts
  │   └── MainLayout.jsx        # Layout principal
  ├── lib/               # Utilidades de bibliotecas
  │   └── utils.js              # Utilidades de Tailwind/shadcn
  ├── styles/            # Estilos globales
  └── data/              # Datos de prueba
└── package.json           # Dependencias y scripts
```

## Inicio Rápido

### Requisitos

- Node.js 18+ 
- npm o yarn
- Backend API corriendo (opcional - ver configuración sin backend)

### Instalación

```bash
# 1. Clonar el repositorio
cd "frontend-petFinder"

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Copiar el archivo .env.example y ajustar según necesites
cp .env.example .env

# 4. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

## Scripts Disponibles

```bash
npm run dev       # Inicia servidor de desarrollo
npm run build     # Construye para producción
npm run preview   # Previsualiza build de producción
npm run lint      # Ejecuta ESLint
```

## Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (copia `.env.example`):

```env
# URL del backend API - cambiar según tu entorno
VITE_API_BASE_URL=http://localhost:3000/api

# Entorno de ejecución
VITE_ENVIRONMENT=development

# Modo offline (sin backend)
VITE_OFFLINE_MODE=false
```

### Trabajo sin Backend

Si aún no tienes el backend configurado:

1. La aplicación te mostrará las páginas de login/registro
2. Los formularios NO funcionarán hasta conectar con el backend
3. Verás errores de red en la consola (esto es normal)
4. Una vez tengas el backend, actualiza `VITE_API_BASE_URL` en el `.env`

### URL del Backend

La URL del backend se configura mediante variables de entorno en el archivo `.env`. El archivo `src/constants/apiEndpoints.js` lee automáticamente esta variable:

```javascript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
```

### Rutas

Definidas en `src/constants/routes.js`:

**Rutas Públicas:**
- `/` - Página de inicio
- `/login` - Inicio de sesión
- `/register` - Registro de usuario
- `/search` - Búsqueda de mascotas

**Rutas Protegidas (requieren autenticación):**
- `/dashboard` - Panel de control del usuario
- `/my-reports` - Mis reportes publicados
- `/publish` - Publicar nuevo reporte
- `/profile` - Perfil del usuario

## Componentes UI

Biblioteca de componentes reutilizables en `src/components/ui/`:

- `Button` - Botones con variantes y tamaños
- `Input` - Campos de entrada con validación
- `Card` - Tarjetas de contenido
- `Badge` - Etiquetas de estado
- `Alert` - Alertas y notificaciones
- Entre otros componentes

## Sistema de Autenticación

- **JWT Tokens** - Autenticación basada en tokens
- **Refresh Tokens** - Renovación automática de sesión
- **Protected Routes** - Rutas protegidas con redirección
- **Axios Interceptors** - Manejo automático de tokens en requests
- **Persistent Sessions** - Sesiones guardadas en localStorage

## Integración de Mapas

Utiliza Leaflet para mostrar ubicaciones de mascotas:

```jsx
import PetMap from './components/PetMap';

<PetMap 
  pets={pets} 
  center={[5.5353, -73.3678]} 
  zoom={13} 
/>
```

## Información del Proyecto

Proyecto desarrollado como trabajo para la Universidad Pedagógica y Tecnológica de Colombia (UPTC), Tunja.

**Desarrollo**: Frontend - React

**Asignatura**: Trabajo de Campo