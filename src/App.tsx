import React, { useEffect } from 'react';
import './index.css';
import './styles/seettu-3d.css';
import Router from './routes/Router.tsx';
import { useSelector } from 'react-redux';
import type { RootState } from './store/store.ts';
import i18n from './i18n.ts';

const App: React.FC = () => {
  const lang = useSelector((s: RootState) => s.language.value);

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  return <Router />;
};

export default App;
