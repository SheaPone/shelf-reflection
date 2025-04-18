import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './CSS/index.css';
import './CSS/layout.css';
import './CSS/styles.css';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import { UserProvider } from './components/UserContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <CartProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CartProvider>
    </UserProvider>
  </React.StrictMode>
);
