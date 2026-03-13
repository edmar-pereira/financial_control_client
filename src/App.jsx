import React from 'react';
import { useLocation } from 'react-router-dom';
import Router from './router';
import Header from './components/header';
import SnackComponent from './components/snackComponent';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { lightMode, darkMode } from './utils/themes';
import { useAPI } from './context/mainContext';

export default function App() {
  const { isDarkMode } = useAPI();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <ThemeProvider theme={isDarkMode ? darkMode : lightMode}>
      <CssBaseline />

      {!isLoginPage && <Header />}
      <SnackComponent />

      <Router />
    </ThemeProvider>
  );
}
