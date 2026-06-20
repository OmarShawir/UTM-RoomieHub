import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then(res => setUser(res.data.user))
        .catch(() => {
          // Backend not reachable yet — fall back to the mock session if we have one
          const mockUser = localStorage.getItem('mockUser');
          if (mockUser) {
            setUser(JSON.parse(mockUser));
          } else {
            localStorage.removeItem('token');
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
    } catch (err) {
      // Backend not available yet — fall back to a mock session so the UI is testable
      if (!err.response) {
        const mockUser = {
          id: 'mock-' + Date.now(),
          full_name: email.split('@')[0],
          email,
          role: email.includes('admin') ? 'admin' : 'student',
        };
        localStorage.setItem('token', 'mock-token');
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        setUser(mockUser);
      } else {
        throw err;
      }
    }
  };

  const register = async ({ fullName, studentId, email, password }) => {
    try {
      const res = await api.post('/auth/register', {
        full_name: fullName,
        student_id: studentId,
        email,
        password,
      });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
    } catch (err) {
      // Backend not available yet — fall back to a mock session so the UI is testable
      if (!err.response) {
        const mockUser = {
          id: 'mock-' + Date.now(),
          full_name: fullName,
          student_id: studentId,
          email,
          role: email.includes('admin') ? 'admin' : 'student',
        };
        localStorage.setItem('token', 'mock-token');
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        setUser(mockUser);
      } else {
        throw err;
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('mockUser');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — use this in any component: const { user } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}