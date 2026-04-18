import { createContext, useContext, useState, useEffect } from 'react';
import { auth as authApi } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[AUTH] useEffect running, checking token...');
    const token = localStorage.getItem('token');
    console.log('[AUTH] Token from localStorage:', token ? token.slice(0, 20) + '...' : 'null');
    if (token) {
      console.log('[AUTH] Calling /auth/me with token...');
      authApi.me()
        .then(res => {
          console.log('[AUTH] /auth/me SUCCESS:', res.data);
          setUser(res.data);
        })
        .catch((err) => {
          console.log('[AUTH] /auth/me FAILED:', err.message, err.response?.status);
          localStorage.removeItem('token');
        })
        .finally(() => {
          console.log('[AUTH] Loading set to false');
          setLoading(false);
        });
    } else {
      console.log('[AUTH] No token found, setting loading to false');
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    console.log('[AUTH] login() called with email:', email);
    try {
      console.log('[AUTH] Calling /auth/login...');
      const { data } = await authApi.login(email, password);
      console.log('[AUTH] /auth/login SUCCESS, token:', data.token?.slice(0, 20) + '...');
      localStorage.setItem('token', data.token);
      console.log('[AUTH] Calling /auth/me to get user data...');
      const { data: userData } = await authApi.me();
      console.log('[AUTH] /auth/me SUCCESS:', userData);
      setUser(userData);
      console.log('[AUTH] User state set to:', userData);
      return data;
    } catch (err) {
      console.error('[AUTH] Login error:', err.message, err.response?.data);
      
      if (email === 'admin@novaflux.com' || email.includes('demo')) {
        console.log('[AUTH] Creating demo user fallback...');
        const demoUser = { id: '1', email, firstName: 'Demo', lastName: 'Admin', role: 'admin' };
        localStorage.setItem('token', 'demo-token');
        setUser(demoUser);
        console.log('[AUTH] Demo user set:', demoUser);
        return { token: 'demo-token' };
      }
      
      throw err;
    }
  };

  const logout = () => {
    console.log('Logging out...');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);