import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token JWT a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores 401
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si recibimos un 401, limpiar el token automáticamente
    if (error.response?.status === 401) {
      console.log("Token inválido o expirado. Limpiando localStorage...");
      removeAuthToken();
      localStorage.removeItem('user_id');
      // Si estamos en una ruta protegida, redirigir al home
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
};

// Funciones de autenticación
export const registerUser = (userData: any) => api.post('/auth/register', userData);
export const loginUser = (credentials: any) => api.post('/auth/login', credentials);
export const fetchCurrentUser = () => api.get('/auth/me');

// Funciones de perfil y portafolio
export const saveRiskProfile = (profileData: any) => api.post('/risk-profile', profileData);
export const optimizePortfolio = (portfolioData: any) => api.post('/optimize', portfolioData);
export const fetchUserPortfolio = (userId: string) => api.get(`/portfolio/${userId}`);
export const simulatePortfolio = (simulationData: any) => api.post('/simulate', simulationData);

// Funciones de soporte y noticias
export const submitContactForm = (contactData: any) => api.post('/support/contact', contactData);
export const fetchNews = () => api.get('/news');

// Funciones de IA
export const getAIExplanation = (concept: string) => api.post('/ai/explain', { concept });

export default api;
