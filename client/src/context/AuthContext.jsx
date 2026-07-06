import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Mocking /auth/me — synchronous, no delay needed in mock mode
      const isAdmin = token === 'fake-admin-token';
      setUser(
        isAdmin
          ? {
              id: 1,
              full_name: 'Dr. Amirul Hadi bin Zulkifli',
              display_name: 'Amirul Hadi',
              email: 'admin@roomiehub.utm.my',
              role: 'admin',
              matric_no: 'ADMIN001',
              bio: 'Platform Administrator for RoomieHub UTM. Responsible for system integrity and user management.',
              profile_picture: 'https://randomuser.me/api/portraits/men/1.jpg',
              nationality: 'Malaysian',
              faculty: 'Faculty of Computing',
              year_of_study: null,
              account_status: 'active',
              created_at: '2024-01-15T08:00:00Z',
            }
          : {
              id: 2,
              full_name: 'Muhammad Haziq bin Rusli',
              display_name: 'Haziq',
              email: 'haziq@graduate.utm.my',
              role: 'student',
              matric_no: 'A22EC0045',
              bio: '3rd year Software Engineering student at UTM. Looking for a quiet and clean roommate near Taman Universiti.',
              profile_picture: 'https://randomuser.me/api/portraits/men/32.jpg',
              nationality: 'Malaysian',
              faculty: 'Faculty of Computing',
              year_of_study: 3,
              account_status: 'active',
              created_at: '2024-03-10T09:30:00Z',
            }
      );
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    // Mocking /auth/login
    return new Promise((resolve) => {
      setTimeout(() => {
        const isAdmin = email.includes('admin');
        const fakeToken = isAdmin ? 'fake-admin-token' : 'fake-user-token';
        const mockUser = isAdmin
          ? {
              id: 1,
              full_name: 'Dr. Amirul Hadi bin Zulkifli',
              display_name: 'Amirul Hadi',
              email: 'admin@roomiehub.utm.my',
              role: 'admin',
              matric_no: 'ADMIN001',
              bio: 'Platform Administrator for RoomieHub UTM. Responsible for system integrity and user management.',
              profile_picture: 'https://randomuser.me/api/portraits/men/1.jpg',
              nationality: 'Malaysian',
              faculty: 'Faculty of Computing',
              year_of_study: null,
              account_status: 'active',
              created_at: '2024-01-15T08:00:00Z',
            }
          : {
              id: 2,
              full_name: 'Muhammad Haziq bin Rusli',
              display_name: 'Haziq',
              email: 'haziq@graduate.utm.my',
              role: 'student',
              matric_no: 'A22EC0045',
              bio: '3rd year Software Engineering student at UTM. Looking for a quiet and clean roommate near Taman Universiti.',
              profile_picture: 'https://randomuser.me/api/portraits/men/32.jpg',
              nationality: 'Malaysian',
              faculty: 'Faculty of Computing',
              year_of_study: 3,
              account_status: 'active',
              created_at: '2024-03-10T09:30:00Z',
            };

        localStorage.setItem('token', fakeToken);
        setUser(mockUser);
        resolve();
      }, 500);
    });
  };

  const register = async ({ fullName, studentId, email, password }) => {
    // Mocking /auth/register
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
    // Registration does NOT return a token — user must verify email first
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // Navigation is handled by the caller (Navbar) using React Router
    // so there's no full-page reload lag here
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — use this in any component: const { user } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
