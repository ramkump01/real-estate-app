import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PropertyForm from './pages/PropertyForm';
import PropertyDetail from './pages/PropertyDetail';
import MyListings from './pages/MyListings';
import { useAuthStore } from './store/authStore';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const { token, setToken } = useAuthStore();

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="pt-20">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Dashboard />} />
              <Route
                path="/create-listing"
                element={
                  <PrivateRoute>
                    <PropertyForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-listings"
                element={
                  <PrivateRoute>
                    <MyListings />
                  </PrivateRoute>
                }
              />
              <Route path="/property/:id" element={<PropertyDetail />} />
            </Routes>
          </main>
          <ToastContainer position="bottom-right" />
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
