import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Main from './pages/main';
import Graphic from './pages/graphic';
import AddExpense from './pages/addExpense';
import Config from './pages/config';
import ImportPage from './pages/importPage';
import Login from './pages/login';
import ProtectedRoute from './components/ProtectedRoute';

export default function Router() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />

      <Route
        path='/'
        element={
          <ProtectedRoute>
            <Main />
          </ProtectedRoute>
        }
      />

      <Route
        path='graphic'
        element={
          <ProtectedRoute>
            <Graphic />
          </ProtectedRoute>
        }
      />

      <Route
        path='add_expense/:id?'
        element={
          <ProtectedRoute>
            <AddExpense />
          </ProtectedRoute>
        }
      />

      <Route
        path='configs'
        element={
          <ProtectedRoute>
            <Config />
          </ProtectedRoute>
        }
      />

      <Route
        path='import'
        element={
          <ProtectedRoute>
            <ImportPage />
          </ProtectedRoute>
        }
      />

      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  );
}
