/**
 * Constantes de Rutas de la Aplicación
 * 
 * Definiciones centralizadas de rutas para la aplicación.
 * Este enfoque proporciona:
 * - Fuente única de verdad para las rutas
 * - Fácil refactorización y mantenimiento
 * - Previene errores tipográficos en las rutas
 * - Mejor soporte de autocompletado del IDE
 */

/**
 * Rutas públicas (accesibles sin autenticación)
 */
export const PUBLIC_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  SEARCH: '/search',
  PET_DETAIL: '/pet/:id',
  STATS: '/statistics',
  ABOUT: '/about',
  CONTACT: '/contact',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  NOT_FOUND: '/404',
};

/**
 * Rutas protegidas (requieren autenticación)
 */
export const PROTECTED_ROUTES = {
  DASHBOARD: '/dashboard',
  MY_REPORTS: '/my-reports',
  PUBLISH_REPORT: '/publish',
  EDIT_REPORT: '/edit-report/:id',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOTIFICATIONS: '/notifications',
};

/**
 * Función auxiliar para generar rutas dinámicas
 * @param {string} route - Plantilla de ruta
 * @param {Object} params - Parámetros de ruta
 * @returns {string} Ruta generada
 */
export const generateRoute = (route, params) => {
  let generatedRoute = route;
  
  Object.keys(params).forEach((key) => {
    generatedRoute = generatedRoute.replace(`:${key}`, params[key]);
  });
  
  return generatedRoute;
};

/**
 * Ejemplo de uso:
 * generateRoute(PUBLIC_ROUTES.PET_DETAIL, { id: 123 }) => '/pet/123'
 * generateRoute(PROTECTED_ROUTES.EDIT_REPORT, { id: 456 }) => '/edit-report/456'
 */
