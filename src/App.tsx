import React, { useEffect } from 'react';
import './index.css';
import './styles/seettu-3d.css';
import Router from './routes/Router.tsx';
import { useSelector } from 'react-redux';
import type { RootState } from './store/store.ts';
import i18n from './i18n.ts';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/authContext.tsx';
import { NotificationProvider } from './context/NotificationProvider.tsx';
import NotificationBell from './components/NotificationBell.tsx';

const App: React.FC = () => {
  const lang = useSelector((s: RootState) => s.language.value);
  const theme = useSelector((s: RootState) => s.theme.value);

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  return (
    <AuthProvider>
      <NotificationProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: theme === 'dark' ? '#1f1f1f' : '#ffffff',
              color: theme === 'dark' ? '#f2f2f2' : '#1a1a1a',
            },
          }}
        />
        <NotificationBell />
        <Router />
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
