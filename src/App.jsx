/**
 * Main App Component
 * 
 * Root component that wraps the entire application.
 * Provides global context providers and routing.
 * 
 * Architecture:
 * - BrowserRouter for client-side routing
 * - AuthProvider for authentication context
 * - ThemeProvider for dark/light mode
 * - NotificationProvider for notification management
 * - AppRouter for all route definitions
 * 
 * This component follows the Provider pattern for global state management.
 */

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRouter from './AppRouter';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppRouter />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
