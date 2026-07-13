import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import API from '../api/client';
import { useAuthStore } from '../store/authStore';
import { Mail } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      const response = await API.post('/auth/google', {
        token: credentialResponse.credential,
      });
      
      const { access_token, user } = response.data;
      setToken(access_token);
      setUser(user);
      
      toast.success(`Welcome, ${user.name}! 🎉`);
      navigate('/');
    } catch (error) {
      toast.error('Failed to login with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleMicrosoftLogin = async () => {
    toast.info('Microsoft OAuth integration available - implement MSALProvider');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">PropertyPro</h1>
        <p className="text-gray-600 text-center mb-8">Sell your property with AI pricing</p>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Login with</h2>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Login failed')}
              />
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <button
            onClick={handleMicrosoftLogin}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            <Mail size={20} />
            Sign in with Microsoft
          </button>
        </div>

        <p className="text-gray-600 text-sm text-center mt-8">
          No account needed - login with your email provider
        </p>
      </div>
    </div>
  );
}
