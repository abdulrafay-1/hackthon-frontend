import { lazy, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from "react-router";
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Layout from './Layout.jsx';
import Login from './pages/Login.jsx';
import NotFound from './components/NotFound.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import UserProvider from './context/userContext.jsx';

createRoot(document.getElementById('root')).render(
  <UserProvider>
    <BrowserRouter>
      <StrictMode>
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route path='' element={<ProtectedRoute children={<App />} />} />
          </Route>
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </StrictMode>
    </BrowserRouter>
  </UserProvider>  // Wrap App component with BrowserRouter for routing
)
