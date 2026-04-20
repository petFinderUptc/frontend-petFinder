/**
 * MainLayout Component
 * 
 * Base layout wrapper for the application.
 * Provides consistent structure with header, main content, and footer.
 */

import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen" style={{ isolation: 'isolate' }}>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
