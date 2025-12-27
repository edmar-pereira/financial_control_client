import React from 'react';
import Router from './router';
import Header from './components/header';
import Loader from './components/loading';
import { useAPI } from './context/mainContext';
import SnackComponent from './components/snackComponent';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { lightMode, darkMode } from './utils/themes';

export default function App() {
  const { loading, isDarkMode } = useAPI();

  return (
    <ThemeProvider theme={isDarkMode ? darkMode : lightMode}>
      <CssBaseline />
      <div>
        <Header />
        <SnackComponent />
        <div>
          {loading ? (
            <div>
              <Loader label={'Carregando gastos...'} />
            </div>
          ) : (
            <div>
              <Router />
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}
