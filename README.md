# PetFinder Frontend

Aplicación web para publicar, buscar y gestionar reportes de mascotas perdidas o encontradas.

Está pensada para un flujo simple de uso: crear reporte, consultar coincidencias, compartir información útil y mantener la cuenta bajo control desde configuración.

## En qué está enfocada la app

- Experiencia pública para búsqueda de reportes.
- Panel autenticado para publicar y administrar reportes propios.
- Integración con backend para IA (análisis de imagen, coincidencias y resumen).
- Configuración de cuenta (tema, notificaciones, seguridad y eliminación de cuenta).

## Stack

- React 18 + Vite
- React Router
- Tailwind CSS + componentes UI internos
- Framer Motion
- Axios
- Leaflet

## Requisitos

- Node.js 18+
- npm 9+
- Backend disponible (por defecto en `http://localhost:3000/api/v1`)

## Instalación y ejecución

```bash
npm install
cp .env.example .env
npm run dev
```

URL local:

- `http://localhost:5173`

## Variables de entorno

- `VITE_API_BASE_URL` (default: `http://localhost:3000/api/v1`)
- `VITE_ENVIRONMENT`
- `VITE_OFFLINE_MODE`

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Estructura resumida

```text
src/
  components/
  pages/
  context/
  hooks/
  services/
  utils/
  constants/
  layouts/
  styles/
```

## Rutas principales

Públicas:

- `/`
- `/search`
- `/pet/:id`
- `/stats`
- `/login`
- `/register`

Protegidas:

- `/dashboard`
- `/my-reports`
- `/publish`
- `/profile`
- `/notifications`
- `/settings`

Admin:

- `/admin`

## Funcionalidades relevantes

### Publicación de reportes

- Carga de imagen con validación básica.
- Análisis de imagen asistido por IA para sugerir atributos.
- Creación de reporte con ubicación y datos de contacto.

### Coincidencias y resumen

Después de publicar un reporte:

- puede mostrar coincidencias automáticas relevantes
- puede mostrar un resumen breve generado por IA en detalle del reporte

### Configuración de cuenta

La pantalla de configuración permite:

- cambiar tema (claro, oscuro, sistema)
- activar o desactivar notificaciones
- cambiar contraseña
- eliminar cuenta con confirmación por contraseña

## Contacto del proyecto

Correo de contacto visible en la app:

- `jhon.castro07@uptc.edu.co`

## Despliegue

Frontend desplegado en Azure Static Web Apps.

Si vas a desplegar cambios en entornos de prueba o producción, valida primero:

- `VITE_API_BASE_URL`
- reglas de rutas en `public/staticwebapp.config.json`

## Estado actual

Proyecto estable para demo funcional, con integración backend activa para:

- autenticación
- reportes
- configuración de usuario
- notificaciones
- funciones asistidas por IA
