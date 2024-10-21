import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Main from './pages/main';
import Graphic from './pages/graphic';
import AddExpense from './pages/addExpense';
import Config from './pages/config';

export default function Router() {
  return (
    <Routes>
      <Route path='/' element={<Main />} />
      <Route path='graphic' element={<Graphic />} />
      <Route path='add_expense/:id?' element={<AddExpense />} />
      <Route path='configs' element={<Config />} />
    </Routes>
  );
}
