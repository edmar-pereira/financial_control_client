import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { APIContextProvider } from './context/mainContext';

import App from './App';

ReactDOM.render(
  <APIContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </APIContextProvider>,
  document.getElementById('root')
);
