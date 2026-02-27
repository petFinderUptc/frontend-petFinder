# PetFinder Frontend - Estructura de Archivos

## Árbol de Directorios Completo

```
frontend-petFinder/
│
├── 📄 package.json                        # Dependencias y scripts npm
├── 📄 package-lock.json                   # Lockfile de dependencias
├── 📄 vite.config.js                      # Configuración de Vite
├── 📄 eslint.config.js                    # Configuración de ESLint
├── 📄 postcss.config.js                   # Configuración de PostCSS
├── 📄 index.html                          # Punto de entrada HTML
│
├── 📄 README.md                           # Guía de inicio rápido
├── 📄 PROJECT_SUMMARY.md                  # Resumen del proyecto
├── 📄 FILE_STRUCTURE.md                   # Este archivo
│
├── 📁 public/                             # Archivos estáticos públicos
│   └── 📄 LOGOPNG.png                     # Logo de la aplicación
│
└── 📁 src/                                # Código fuente
    │
    ├── 📄 main.jsx                        # Punto de entrada de React
    ├── 📄 App.jsx                         # Componente raíz con providers
    ├── 📄 AppRouter.jsx                   # Configuración de rutas
    ├── 📄 index.css                       # Estilos globales
    │
    ├── 📁 components/                     # Componentes reutilizables
    │   │
    │   ├── 📄 Header.jsx                  # Barra de navegación principal
    │   ├── 📄 Footer.jsx                  # Pie de página
    │   ├── 📄 PetCard.jsx                 # Tarjeta de mascota
    │   ├── 📄 PetMap.jsx                  # Mapa interactivo con Leaflet
    │   ├── 📄 FilterPanel.jsx             # Panel de filtros de búsqueda
    │   ├── 📄 ProtectedRoute.jsx          # HOC para rutas protegidas
    │   │
    │   └── 📁 ui/                         # Componentes UI base
    │       ├── 📄 accordion.jsx           # Acordeón expandible
    │       ├── 📄 alert.jsx               # Alertas y notificaciones
    │       ├── 📄 alert-dialog.jsx        # Diálogos de confirmación
    │       ├── 📄 avatar.jsx              # Avatares de usuario
    │       ├── 📄 badge.jsx               # Etiquetas de estado
    │       ├── 📄 button.jsx              # Botones con variantes
    │       ├── 📄 calendar.jsx            # Selector de fechas
    │       ├── 📄 card.jsx                # Contenedores de contenido
    │       ├── 📄 carousel.jsx            # Carrusel de imágenes
    │       ├── 📄 checkbox.jsx            # Casillas de verificación
    │       ├── 📄 command.jsx             # Paleta de comandos
    │       ├── 📄 dialog.jsx              # Diálogos modales
    │       ├── 📄 dropdown-menu.jsx       # Menús desplegables
    │       ├── 📄 form.jsx                # Componentes de formulario
    │       ├── 📄 input.jsx               # Campos de entrada
    │       ├── 📄 label.jsx               # Etiquetas de formulario
    │       ├── 📄 popover.jsx             # Popovers
    │       ├── 📄 progress.jsx            # Barras de progreso
    │       ├── 📄 radio-group.jsx         # Grupos de radio buttons
    │       ├── 📄 scroll-area.jsx         # Áreas con scroll
    │       ├── 📄 select.jsx              # Selectores
    │       ├── 📄 separator.jsx           # Separadores visuales
    │       ├── 📄 sheet.jsx               # Paneles laterales
    │       ├── 📄 skeleton.jsx            # Placeholders de carga
    │       ├── 📄 slider.jsx              # Controles deslizantes
    │       ├── 📄 switch.jsx              # Switches on/off
    │       ├── 📄 table.jsx               # Tablas de datos
    │       ├── 📄 tabs.jsx                # Pestañas
    │       ├── 📄 textarea.jsx            # Áreas de texto
    │       ├── 📄 toast.jsx               # Notificaciones toast
    │       └── 📄 tooltip.jsx             # Tooltips informativos
    │
    ├── 📁 pages/                          # Páginas de la aplicación
    │   │
    │   ├── 📄 HomePage.jsx                # Página de inicio / landing
    │   │
    │   ├── 📁 auth/                       # Páginas de autenticación
    │   │   ├── 📄 LoginPage.jsx           # Inicio de sesión
    │   │   └── 📄 RegisterPage.jsx        # Registro de usuario
    │   │
    │   ├── 📁 pet/                        # Páginas de mascotas
    │   │   ├── 📄 SearchPage.jsx          # Búsqueda de mascotas
    │   │   └── 📄 PublishReportPage.jsx   # Publicar reporte
    │   │
    │   └── 📁 user/                       # Páginas de usuario
    │       └── 📄 DashboardPage.jsx       # Panel de control del usuario
    │
    ├── 📁 layouts/                        # Layouts de página
    │   └── 📄 MainLayout.jsx              # Layout principal con Header/Footer
    │
    ├── 📁 lib/                           # Utilidades de bibliotecas
    │   └── 📄 utils.js                    # Utilidades para Tailwind/shadcn (cn helper)
    │
    ├── 📁 context/                        # Context API de React
    │   └── 📄 AuthContext.jsx             # Contexto de autenticación
    │
    ├── 📁 services/                       # Servicios de API
    │   │
    │   ├── 📁 api/                        # Configuración de API
    │   │   └── 📄 apiClient.js            # Cliente Axios con interceptores
    │   │
    │   ├── 📄 authService.js              # Servicios de autenticación
    │   ├── 📄 petService.js               # Servicios de mascotas/reportes
    │   └── 📄 userService.js              # Servicios de perfil de usuario
    │
    ├── 📁 hooks/                          # Custom React Hooks
    │   ├── 📄 useForm.js                  # Gestión de estado de formularios
    │   ├── 📄 useApi.js                   # Manejo de llamadas API
    │   ├── 📄 useDebounce.js              # Hook de debouncing
    │   ├── 📄 useLocalStorage.js          # Estado persistente en localStorage
    │   └── 📄 useToggle.js                # Hook para toggles booleanos
    │
    ├── 📁 utils/                          # Funciones utilitarias
    │   ├── 📄 validation.js               # Funciones de validación
    │   ├── 📄 helpers.js                  # Funciones auxiliares generales
    │   └── 📄 storage.js                  # Wrapper de localStorage
    │
    ├── 📁 constants/                      # Constantes de la aplicación
    │   ├── 📄 apiEndpoints.js             # URLs de endpoints de API
    │   ├── 📄 routes.js                   # Rutas de navegación
    │   └── 📄 appConfig.js                # Configuración global
    │
    ├── 📁 data/                           # Datos mock para desarrollo
    │   └── 📄 mockPets.js                 # Datos de ejemplo de mascotas
    │
    └── 📁 styles/                         # Estilos globales
        ├── 📄 tailwind.css                # Importación de Tailwind
        ├── 📄 fonts.css                   # Fuentes personalizadas
        ├── 📄 theme.css                   # Variables de tema
        └── 📄 leaflet.css                 # Estilos de mapas
```

## Descripción de Archivos Clave

### Configuración

| Archivo | Propósito |
|---------|-----------|
| `package.json` | Dependencias, scripts y metadata del proyecto |
| `vite.config.js` | Configuración del bundler Vite |
| `eslint.config.js` | Reglas de linting de código |
| `postcss.config.js` | Procesamiento de CSS (Tailwind) |
| `index.html` | Template HTML base |

### Código Principal

| Archivo | Propósito |
|---------|-----------|
| `src/main.jsx` | Entry point, renderiza App en el DOM |
| `src/App.jsx` | Componente raíz, configura providers |
| `src/AppRouter.jsx` | Definición de todas las rutas |

### Componentes

| Carpeta/Archivo | Propósito |
|-----------------|-----------|
| `components/ui/` | Biblioteca de componentes UI reutilizables |
| `Header.jsx` | Navegación principal con auth |
| `Footer.jsx` | Footer informativo |
| `PetCard.jsx` | Tarjeta de visualización de mascota |
| `PetMap.jsx` | Mapa interactivo con marcadores |
| `FilterPanel.jsx` | Filtros de búsqueda avanzada |
| `ProtectedRoute.jsx` | Wrapper para rutas autenticadas |

### Páginas

| Archivo | Ruta | Descripción |
|---------|------|-------------|
| `HomePage.jsx` | `/` | Landing page con estadísticas |
| `LoginPage.jsx` | `/login` | Autenticación de usuarios |
| `RegisterPage.jsx` | `/register` | Registro de nuevos usuarios |
| `SearchPage.jsx` | `/search` | Búsqueda de mascotas |
| `PublishReportPage.jsx` | `/publish` | Crear reporte (protegida) |
| `DashboardPage.jsx` | `/dashboard` | Panel usuario (protegida) |

### Servicios

| Archivo | Propósito |
|---------|-----------|
| `apiClient.js` | Cliente HTTP con interceptores |
| `authService.js` | Login, registro, logout, refresh |
| `petService.js` | CRUD de reportes de mascotas |
| `userService.js` | Perfil y configuración |

### Hooks Personalizados

| Hook | Uso |
|------|-----|
| `useForm` | Gestión de formularios con validación |
| `useApi` | Llamadas API con loading/error |
| `useDebounce` | Retrasar actualizaciones |
| `useLocalStorage` | Persistir estado |
| `useToggle` | Estados booleanos |

### Utilidades

| Archivo | Contiene |
|---------|----------|
| `validation.js` | Funciones de validación de formularios |
| `helpers.js` | Utilidades generales |
| `storage.js` | Abstracción de localStorage |

### Constantes

| Archivo | Define |
|---------|--------|
| `apiEndpoints.js` | URLs de todos los endpoints |
| `routes.js` | Rutas públicas y protegidas |
| `appConfig.js` | Configuración global de la app |

## Convenciones de Nombres

- **Componentes**: PascalCase (`PetCard.jsx`)
- **Hooks**: camelCase con prefijo `use` (`useForm.js`)
- **Servicios**: camelCase con sufijo `Service` (`authService.js`)
- **Utilidades**: camelCase (`helpers.js`)
- **Constantes**: UPPER_SNAKE_CASE dentro de archivos camelCase
- **Utilidades**: camelCase (`helpers.js`)
- **Constantes**: UPPER_SNAKE_CASE dentro de archivos camelCase

## Organización por Funcionalidad

### Autenticaciónxt.jsx
services/authService.js
pages/auth/LoginPage.jsx
pages/auth/RegisterPage.jsx
components/ProtectedRoute.jsx
```

### Mascotas
```
services/petService.js
pages/pet/SearchPage.jsx
pages/pet/PublishReportPage.jsx
components/PetCard.jsx
components/PetMap.jsx
components/FilterPanel.jsx
data/mockPets.js
```

components/FilterPanel.jsx
data/mockPets.js
```

### Interfaz de Usuarios/Footer.jsx
layouts/MainLayout.jsx
styles/
```

layouts/MainLayout.jsx
styles/
```

## Estilos

- **Tailwind CSS**: Framework principal de estilos
- **CSS Modules**: No usados, todo con Tailwind
- **Global Styles**: En `src/styles/`
- **Component Styles**: Clases de Tailwind inline  ├── 📄 apiEndpoints.js             # API endpoint definitions
        ├── 📄 routes.js                   # Route path constants
        └── 📄 appConfig.js                # App configuration

```

## 📊 File Count Summary

### By Category

| Category | Count | Purpose |
|----------|-------|---------|
| **Pages** | 6 components + 6 CSS files = 12 | Full-page components |
| **Components** | 9 components + 8 CSS files = 17 | Reusable UI elements |
| **Services** | 4 files | API communication layer |
| **Hooks** | 5 files | Custom React hooks |
| **Utils** | 3 files | Helper functions |
| **Constants** | 3 files | Configuration & constants |
| **Context** | 1 file | Global state management |
| **Layouts** | 2 files | Page structure templates |
| **Config** | 5 files | Project configuration |
| **Documentation** | 4 files | Project documentation |
| **Total** | **~60+ files** | Complete application |

### By File Type

| Type | Count | Description |
|------|-------|-------------|
| `.jsx` | 25+ | React components |
| `.js` | 13+ | JavaScript modules |
| `.css` | 15+ | Stylesheets |
| `.md` | 4 | Documentation |
| `.json` | 2 | Configuration |
| `.html` | 1 | Entry HTML |

## 🎯 Key File Descriptions

### Core Application Files

**`main.jsx`**
- Application entry point
- Renders React app into DOM
- Wraps app with StrictMode

**`App.jsx`**
- Root component
- Provides BrowserRouter
- Wraps with AuthProvider
- Renders AppRouter

**`AppRouter.jsx`**
- All route definitions
- Public and protected routes
- 404 handling
- Layout integration

### Component Files

**Authentication**
- `ProtectedRoute.jsx` - Guards protected routes

**Common UI**
- `Button.jsx` - Reusable button with variants
- `Input.jsx` - Form input with validation
- `LoadingSpinner.jsx` - Loading indicator
- `Header.jsx` - App navigation
- `Footer.jsx` - App footer

### Page Files

**Public Pages**
- `HomePage.jsx` - Landing page
- `LoginPage.jsx` - User login
- `RegisterPage.jsx` - User registration
- `SearchPage.jsx` - Pet search

**Protected Pages**
- `DashboardPage.jsx` - User dashboard
- `PublishReportPage.jsx` - Create pet report

### Service Files

**`apiClient.js`**
- Configured Axios instance
- Request/response interceptors
- JWT token injection
- Error handling

**`authService.js`**
- Login/register/logout
- Token management
- User authentication

**`petService.js`**
- Pet CRUD operations
- Search functionality
- Image uploads

**`userService.js`**
- User profile operations
- Password changes
- Account management

### Hook Files

**`useForm.js`**
- Form state management
- Validation handling
- Submit logic

**`useApi.js`**
- API call wrapper
- Loading/error states
- Data caching

**`useDebounce.js`**
- Value debouncing
- Search optimization

**`useLocalStorage.js`**
- Persistent state
- localStorage sync

**`useToggle.js`**
- Boolean state management
- Modal/drawer control

### Utility Files

**`helpers.js`**
- Date formatting
- Text manipulation
- Distance calculation
- Generic utilities

**`storage.js`**
- Safe localStorage operations
- JSON serialization
- Error handling

**`validation.js`**
- Form field validators
- Email/password validation
- Phone number validation
- File validation

### Constant Files

**`apiEndpoints.js`**
- All API endpoint paths
- RESTful resource URIs
- Centralized endpoint management

**`routes.js`**
- Application route paths
- Public route constants
- Protected route constants
- Route generation helpers

**`appConfig.js`**
- App-wide settings
- Storage keys
- Pet types
- Report statuses
- Pagination settings
- File upload limits
- Validation rules
- Map configuration

## 🔍 File Relationships

### Data Flow Example: Login

```
LoginPage.jsx
    ↓ (uses)
useForm.js
    ↓ (validates with)
validation.js
    ↓ (submits via)
authService.js
    ↓ (uses)
apiClient.js
    ↓ (updates)
AuthContext.jsx
    ↓ (triggers)
Navigation to Dashboard
```

### Component Hierarchy

```
App.jsx
└── BrowserRouter
    └── AuthProvider
        └── AppRouter
            └── Routes
                ├── Public Routes
                │   └── MainLayout
                │       ├── Header
                │       ├── Page Content
                │       └── Footer
                └── Protected Routes
                    └── ProtectedRoute
                        └── MainLayout
                            ├── Header
                            ├── Page Content
                            └── Footer
```

## 📚 Import Patterns

### Typical Component Imports

```javascript
// React & Router
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Context & Hooks
import { useAuth } from '../../context/AuthContext';
import { useForm } from '../../hooks/useForm';

// Components
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

// Services
import * as authService from '../../services/authService';

// Utils & Constants
import { validateEmail } from '../../utils/validation';
import { PUBLIC_ROUTES } from '../../constants/routes';

// Styles
import './ComponentName.css';
```

## 🎨 CSS Organization

Each component has its own CSS file:
- Scoped styles
- BEM-like naming convention
- Responsive breakpoints
- CSS variables for theming

Global styles in `index.css`:
- CSS reset
- CSS variables
- Typography
- Utility classes

---

**This structure provides**:
- ✅ Clear organization
- ✅ Easy navigation
- ✅ Scalable architecture
- ✅ Maintainable codebase
