/**
 * Main App Component
 * 
 * Root component that wraps the entire application.
 * Provides global context providers and routing.
 * 
 * Architecture:
 * - BrowserRouter for client-side routing
 * - AuthProvider for authentication context
 * - AppRouter for all route definitions
 * 
 * This component follows the Provider pattern for global state management.
 */

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './AppRouter';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
