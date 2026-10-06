import { useState } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, X, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoPulso from '../../../assets/Logo.png';
import { NAV_CATEGORIES } from '../../../models/navigation.data';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-[#0a0a0a] text-white sticky top-0 z-50 shadow-md">
      {/* Nivel Superior */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-white p-1"
          aria-label="Abrir menú"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo que apunta al inicio */}
        <Link to="/" className="flex items-center shrink-0">
          <img 
            src={logoPulso} 
            alt="Pulso Deportes" 
            className="h-8 md:h-10 w-auto object-contain"
          />
        </Link>

        {/* Buscador central */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="¿Qué estás buscando?"
              className="w-full bg-neutral-900/80 border border-neutral-800 rounded-full py-2 pl-4 pr-10 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[var(--color-pulso-lime)] transition-colors"
            />
            <button 
              type="button" 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* Acciones de usuario */}
        <div className="flex items-center gap-5">
          {/* Único botón: Mi cuenta */}
          <Link
            to="/admin"
            className="flex items-center gap-1.5 text-xs text-neutral-300 hover:text-[var(--color-pulso-lime)] font-semibold transition-colors"
          >
            <User size={18} />
            <span className="hidden sm:inline">Mi cuenta</span>
          </Link>

          <button className="relative text-neutral-300 hover:text-white" aria-label="Favoritos">
            <Heart size={20} />
          </button>

          <button className="relative flex items-center text-neutral-300 hover:text-white" aria-label="Carrito">
            <ShoppingBag size={21} />
            <span className="absolute -top-2 -right-2 bg-[var(--color-pulso-lime)] text-black text-[10px] font-black rounded-full h-4.5 w-4.5 flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      </div>

      {/* Buscador Móvil */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="¿Qué estás buscando?"
            className="w-full bg-neutral-900 border border-neutral-800 rounded-full py-1.5 pl-4 pr-10 text-sm text-white placeholder-neutral-500"
          />
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        </div>
      </div>

      {/* Categorías (Desktop) */}
      <nav className="border-t border-neutral-900/80 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-8 py-2.5 text-xs font-semibold tracking-wider">
          {NAV_CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={cat.href}
              className={`transition-colors py-1 ${
                cat.isPrimary 
                  ? 'text-[var(--color-pulso-lime)] hover:brightness-110 font-bold' 
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              {cat.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Menú Desplegable Móvil con link a Admin */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-950 border-t border-neutral-800 px-6 py-4 flex flex-col gap-3 text-sm">
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-[var(--color-pulso-lime)] font-bold flex items-center gap-2 border-b border-neutral-800"
          >
            <ShieldAlert size={16} />
            <span>Panel de Administración</span>
          </Link>
          {NAV_CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={cat.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`py-1.5 ${
                cat.isPrimary ? 'text-[var(--color-pulso-lime)] font-bold' : 'text-neutral-300'
              }`}
            >
              {cat.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};