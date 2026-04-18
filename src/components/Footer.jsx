import { Link } from 'react-router-dom';
import { PUBLIC_ROUTES, PROTECTED_ROUTES } from '../constants/routes';

export function Footer() {
  return (
    <footer className="border-t bg-background py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Logo y descripción */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="/LOGOPNG.png" alt="PetFinder" className="h-10 w-auto" />
            </div>
            <p className="text-sm text-muted-foreground">
              Plataforma de reencuentro de mascotas en Tunja y alrededores.
            </p>
          </div>

          {/* Links rápidos */}
          <div>
            <h3 className="font-semibold mb-3">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to={PUBLIC_ROUTES.HOME} className="hover:text-blue-600">Inicio</Link></li>
              <li><Link to={PUBLIC_ROUTES.SEARCH} className="hover:text-blue-600">Buscar mascotas</Link></li>
              <li><Link to={PROTECTED_ROUTES.PUBLISH_REPORT} className="hover:text-blue-600">Publicar reporte</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-semibold mb-3">Contacto</h3>
            <p className="text-sm text-muted-foreground">
              Email: <a href="mailto:notificacions.petfinder@gmail.com" className="hover:text-blue-600">notificacions.petfinder@gmail.com</a><br />
              Tunja, Boyacá, Colombia
            </p>
          </div>
        </div>

        <div className="border-t pt-6 text-center text-sm text-muted-foreground">
          <p>© 2026 PetFinder. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
