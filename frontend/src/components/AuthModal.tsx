// Componente de autenticación simple
import React, { useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/api';

// Props para el modal de autenticación
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (source: 'login' | 'register') => void;
  initialMode?: 'login' | 'register';
}

// Modal de autenticación para login y registro
const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess, initialMode = 'login' }) => {
  // Estado para alternar entre registro y login (inicializa según initialMode)
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  // Estado para los campos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  // Estado para mostrar errores
  const [error, setError] = useState<string | null>(null);
  // Estado para mostrar carga
  const [loading, setLoading] = useState<boolean>(false);
  // Estado para mostrar éxito en registro
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Actualizar el modo cuando cambia initialMode
  useEffect(() => {
    setIsRegister(initialMode === 'register');
  }, [initialMode, isOpen]);

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isRegister) {
        // Registro de usuario
        await registerUser({ name, email, password });
        // Después del registro, hacer login automático
        const loginResponse = await loginUser({ email, password });
        localStorage.setItem('token', loginResponse.data.access_token);
        // Decodificar el token para obtener el user_id
        const decodedToken = JSON.parse(atob(loginResponse.data.access_token.split('.')[1]));
        localStorage.setItem('user_id', decodedToken.user_id);
        onLoginSuccess('register');
      } else {
        // Login de usuario
        const response = await loginUser({ email, password });
        localStorage.setItem('token', response.data.access_token);
        // Decodificar el token para obtener el user_id
        const decodedToken = JSON.parse(atob(response.data.access_token.split('.')[1]));
        localStorage.setItem('user_id', decodedToken.user_id);
        onLoginSuccess('login');
      }
    } catch (err: any) {
      // Mostrar error si ocurre
      setError(err.response?.data?.detail || 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  // Render del modal
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="relative p-8 bg-white rounded-lg shadow-xl max-w-md w-full animate-fade-in">
        {/* Botón para cerrar el modal */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        {/* Título del modal */}
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
          {isRegister ? 'Regístrate' : 'Inicia Sesión'}
        </h2>

        {/* Mensaje de éxito tras el registro */}
        {registerSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
            Registro exitoso. Ahora puedes iniciar sesión con tu correo y contraseña.
          </div>
        )}

        {/* Formulario de login/registro */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">Nombre</label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">Contraseña</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* En login, mostrar enlace para recuperar contraseña */}
            {!isRegister && (
              <div className="text-right mt-1">
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800">¿Olvidaste tu contraseña?</a>
              </div>
            )}
          </div>

          {/* Mostrar error si existe */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Botón para enviar el formulario */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Cargando...' : (isRegister ? 'Registrarse' : 'Iniciar Sesión')}
          </button>
        </form>

        {/* Alternar entre login y registro */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            {isRegister ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}{' '}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {isRegister ? 'Inicia Sesión' : 'Regístrate'}
            </button>
          </p>
        </div>

        {/* Botones sociales (no funcionales) */}
        <div className="mt-6 border-t border-gray-200 pt-6 space-y-3">
          <button className="w-full flex items-center justify-center bg-white border border-gray-300 text-slate-700 py-2 px-4 rounded-lg shadow-sm hover:bg-gray-50 transition duration-300">
            <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" className="mr-2" />
            Continuar con Google
          </button>
          <button className="w-full flex items-center justify-center bg-white border border-gray-300 text-slate-700 py-2 px-4 rounded-lg shadow-sm hover:bg-gray-50 transition duration-300">
            <img src="https://img.icons8.com/ios-glyphs/16/000000/github.png" alt="GitHub" className="mr-2" />
            Continuar con GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
