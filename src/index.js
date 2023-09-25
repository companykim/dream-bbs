import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import BBSNav from 'layout/BBSNav';
import Footer from 'layout/Footer';

import App from './App';
import { BrowserRouter as Router } from "react-router-dom"
import { AppContextProvider } from 'context/AppContextProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <AppContextProvider>
    <Router>
      <BBSNav />
      <App />
      <Footer />
    </Router>
  </AppContextProvider>
);

