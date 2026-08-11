import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AppProvider } from './context/AppContext'
import './index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" />
      </BrowserRouter>
    </AppProvider>
  </React.StrictMode>,
)
