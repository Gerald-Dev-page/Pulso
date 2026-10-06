// src/views/pages/Login.jsx
import { useState } from 'react';
import { useAuth } from '../../controllers/AuthContext';
import { Lock, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoPulso from '../../assets/Logo.png';

export const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await login(email, password);
    } catch (err) {
      setErrorMsg(err.message === 'Invalid login credentials' ? 'Credenciales incorrectas' : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col justify-center items-center px-4 font-sans">
      <div className="w-full max-w-md bg-[#0f0f0f] border border-neutral-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex justify-center mb-6">
          <img src={logoPulso} alt="Pulso Deportes" className="h-9 w-auto object-contain" />
        </div>

        <h2 className="text-xl font-black italic uppercase tracking-tight text-center mb-2">
          Acceso Administrador
        </h2>
        <p className="text-xs text-neutral-400 text-center mb-6">
          Ingresa con tu correo y contraseña para gestionar la tienda.
        </p>

        {errorMsg && (
          <div className="bg-rose-950/80 border border-rose-800 text-rose-300 text-xs p-3 rounded-lg mb-4 text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Correo electrónico</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pulsodeportes.com"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-[var(--color-pulso-lime)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Contraseña</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-[var(--color-pulso-lime)]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--color-pulso-lime)] text-black font-black uppercase text-xs rounded-xl tracking-wider hover:brightness-110 disabled:opacity-50 transition-all"
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-neutral-800 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft size={14} />
            <span>Volver a la tienda</span>
          </Link>
        </div>
      </div>
    </div>
  );
};