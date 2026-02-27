/**
 * Application Routes Constants
 * 
 * Centralized route definitions for the application.
 * This approach provides:
 * - Single source of truth for routes
 * - Easy refactoring and maintenance
 * - Prevents typos in route paths
 * - Better IDE autocomplete support
 */

/**
 * Public routes (accessible without authentication)
 */
export const PUBLIC_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  SEARCH: '/search',
  PET_DETAIL: '/pet/:id',
  ABOUT: '/about',
  CONTACT: '/contact',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  NOT_FOUND: '/404',
};

/**
 * Protected routes (require authentication)
 */
export const PROTECTED_ROUTES = {
  DASHBOARD: '/dashboard',
  MY_REPORTS: '/my-reports',
  PUBLISH_REPORT: '/publish',
  EDIT_REPORT: '/edit-report/:id',
  PROFILE: '/profile',
  SETTINGS: '/settings',
};

/**
 * Helper function to generate dynamic routes
 * @param {string} route - Route template
 * @param {Object} params - Route parameters
 * @returns {string} Generated route
 */
export const generateRoute = (route, params) => {
  let generatedRoute = route;
  
  Object.keys(params).forEach((key) => {
    generatedRoute = generatedRoute.replace(`:${key}`, params[key]);
  });
  
  return generatedRoute;
};

/**
 * Example usage:
 * generateRoute(PUBLIC_ROUTES.PET_DETAIL, { id: 123 }) => '/pet/123'
 * generateRoute(PROTECTED_ROUTES.EDIT_REPORT, { id: 456 }) => '/edit-report/456'
 */
