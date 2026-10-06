// src/views/components/layout/Footer.jsx
import { Phone, Mail, MapPin } from 'lucide-react';
import logoPulso from '../../../assets/Logo.png';

// Icono SVG nativo para Instagram
const InstagramIcon = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const Footer = () => {
  return (
    <footer className="bg-[#050505] border-t border-neutral-900 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Columna 1: Marca y Propósito */}
        <div className="space-y-4">
          <img src={logoPulso} alt="Pulso Deportes" className="h-8 w-auto" />
          <p className="text-neutral-400 leading-relaxed">
            Movimiento que te lleva más lejos. Indumentaria técnica deportiva y equipamiento de alto rendimiento.
          </p>
          <div className="flex items-center gap-3 text-white pt-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-neutral-900 hover:text-[var(--color-pulso-lime)] rounded-full transition-colors"
              aria-label="Instagram de Pulso Deportes"
            >
              <InstagramIcon size={16} />
            </a>
          </div>
        </div>

        {/* Columna 2: Disciplinas */}
        <div>
          <h4 className="text-white font-extrabold uppercase tracking-wider mb-4">Disciplinas</h4>
          <ul className="space-y-2">
            <li><a href="#futbol" className="hover:text-white transition-colors">Fútbol</a></li>
            <li><a href="#running" className="hover:text-white transition-colors">Running</a></li>
            <li><a href="#training" className="hover:text-white transition-colors">Fitness & Training</a></li>
            <li><a href="#padel" className="hover:text-white transition-colors">Pádel</a></li>
            <li><a href="#outdoor" className="hover:text-white transition-colors">Outdoor</a></li>
            <li><a href="#accesorios" className="hover:text-white transition-colors">Accesorios</a></li>
          </ul>
        </div>

        {/* Columna 3: Ayuda & Políticas */}
        <div>
          <h4 className="text-white font-extrabold uppercase tracking-wider mb-4">Ayuda & Guías</h4>
          <ul className="space-y-2">
            <li><a href="#talles" className="hover:text-white transition-colors">Guía de Talles</a></li>
            <li><a href="#envios" className="hover:text-white transition-colors">Política de Envíos</a></li>
            <li><a href="#cambios" className="hover:text-white transition-colors">Cambios y Devoluciones</a></li>
            <li><a href="#terminos" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
            <li><a href="#privacidad" className="hover:text-white transition-colors">Política de Privacidad</a></li>
          </ul>
        </div>

        {/* Columna 4: Contacto directo */}
        <div>
          <h4 className="text-white font-extrabold uppercase tracking-wider mb-4">Contacto</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-2.5">
              <Phone size={15} className="text-[var(--color-pulso-lime)] shrink-0" />
              <span>+54 9 11 1234-5678</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={15} className="text-[var(--color-pulso-lime)] shrink-0" />
              <span>ventas@pulsodeportes.com</span>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin size={15} className="text-[var(--color-pulso-lime)] shrink-0" />
              <span>Buenos Aires, Argentina</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-900/80 py-6 text-center text-neutral-500 text-[11px]">
        © {new Date().getFullYear()} Pulso Deportes. Todos los derechos reservados.
      </div>
    </footer>
  );
};