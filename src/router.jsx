import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import Main from './pages/main';
import Graphic from './pages/graphic';
import AddExpense from './pages/addExpense';
import Config from './pages/config';
import ImportPage from './pages/importPage';
import Login from './pages/login';
import ProtectedRoute from './components/ProtectedRoute';

export default function Router() {
  const isLoggedIn = !!localStorage.getItem('accessToken'); // verifica token

  const location = useLocation();

  useEffect(() => {
    console.log('Path atual:', location.pathname);
  }, [location]);

  return (
    <Routes>
      {/* Página de login */}
      <Route
        path='/login'
        element={isLoggedIn ? <Navigate to='/' replace /> : <Login />}
      />

      {/* Rotas protegidas */}
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <Main />
          </ProtectedRoute>
        }
      />

      <Route
        path='/graphic'
        element={
          <ProtectedRoute>
            <Graphic />
          </ProtectedRoute>
        }
      />

      <Route
        path='/add_expense/:id?'
        element={
          <ProtectedRoute>
            <AddExpense />
          </ProtectedRoute>
        }
      />

      <Route
        path='/configs'
        element={
          <ProtectedRoute>
            <Config />
          </ProtectedRoute>
        }
      />

      <Route
        path='/import'
        element={
          <ProtectedRoute>
            <ImportPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback condicional para qualquer rota inválida */}
      <Route
        path='*'
        element={
          isLoggedIn ? (
            <Navigate to='/' replace />
          ) : (
            <Navigate to='/login' replace />
          )
        }
      />
    </Routes>
  );
}
