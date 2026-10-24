import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Iniciar Sesión</h2>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-lg">{error}</div>}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Correo Electrónico</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm" required />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contraseña</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm" required />
        </div>
        <button type="submit" className="w-full bg-slate-900 text-emerald-400 font-bold p-2.5 rounded-lg text-sm transition-colors shadow">
          Ingresar al Sistema
        </button>
      </form>
    </div>
  );
};
