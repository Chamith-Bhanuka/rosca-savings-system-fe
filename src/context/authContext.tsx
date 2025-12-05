import { createContext, useContext, useEffect, useState } from 'react';
import { getMyDetails } from '../services/auth.service.ts';
import Loader from '../components/Loader.tsx';
import { logout_user } from '../services/auth.service.ts';

type AuthUser = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setLoading(false);
      return;
    }

    getMyDetails()
      .then((res) => {
        const userData = res.data;
        setUser({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: userData.role,
        });
      })
      .catch(() => {
        localStorage.removeItem('accessToken');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader />;
  }

  const logout = async () => {
    await logout_user();
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within a AuthProvider');
  return context;
};
