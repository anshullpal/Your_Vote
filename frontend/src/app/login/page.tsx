'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Must use next/navigation in App Router
import api from '@/utils/api'; 
import { useAuth } from '@/context/AuthContext'; // To update context state

const LoginPage = () => {
  const [formData, setFormData] = useState({
    aadharCardNumber: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { fetchUserProfile } = useAuth(); // Use fetchUserProfile to initialize state

  // Tailwind classes for consistent, dark, and visible input text
  const inputClass = 'w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); 
    setLoading(true);

    const dataToSend = { 
      aadharCardNumber: Number(formData.aadharCardNumber),
      password: formData.password,
    };

    try {
      // API call to the backend login route: POST /user/login
      const response = await api.post('/user/login', dataToSend);

      const { token } = response.data; // Response contains {token: "JWT_TOKEN"}

      // 1. Store the JWT Token
      localStorage.setItem('token', token);

      // 2. Fetch User Profile to get role and update global state
      await fetchUserProfile(); 
      
      // 3. Redirect to the root (which handles role-based redirection to /voter or /admin)
      router.push('/'); 

    } catch (err: any) {
      // Handle login errors (e.g., Invalid Aadhar Card Number or Password)
      const errMsg = err.response?.data?.error || err.response?.data?.message || 'Login failed due to a network error.';
      setError(errMsg);
      console.error('Login Error:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900">Sign in to Vote</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          {error && <p className="p-2 text-red-500 text-sm text-center bg-red-50 rounded-md">{error}</p>}
          
          <div>
            <label htmlFor="aadhar" className="block text-sm font-medium text-gray-700">
              Aadhar Card Number
            </label>
            <input
              id="aadharCardNumber"
              name="aadharCardNumber"
              type="text"
              required
              className={inputClass}
              value={formData.aadharCardNumber}
              onChange={handleChange}
              placeholder="12-digit number"
              minLength={12}
              maxLength={12}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={inputClass}
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Don't have an account? <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
