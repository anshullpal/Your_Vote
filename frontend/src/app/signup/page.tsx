'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// FIX: Change alias import to relative import for context and api
import api from '../../utils/api'; 
import { useAuth } from '../../context/AuthContext';

const initialFormState = {
  name: '',
  age: 0,
  address: '',
  aadharCardNumber: '',
  password: '',
  email: '',
  mobile: '',
  role: 'voter',
};

type SignupFormState = typeof initialFormState;

const SignupPage = () => {
  const [formData, setFormData] = useState<SignupFormState>(initialFormState);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // We use fetchUserProfile to refresh the global state after successful signup
  const { fetchUserProfile } = useAuth(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.name === 'age' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (String(formData.aadharCardNumber).length !== 12) {
      setLoading(false);
      return setError('Aadhar Card Number must be exactly 12 digits.');
    }

    // Prepare data: delete optional fields if they are empty strings
    const dataToSend: Partial<SignupFormState> = { ...formData };
    dataToSend.aadharCardNumber = Number(formData.aadharCardNumber);
    if (!dataToSend.email) delete dataToSend.email;
    if (!dataToSend.mobile) delete dataToSend.mobile;

    try {
      const response = await api.post('/user/signup', dataToSend);
      const { token } = response.data;

      // 1. Store the token
      localStorage.setItem('token', token);
      
      // 2. Fetch profile to initialize AuthContext with user data (role, etc.)
      // This call should now succeed because fetchUserProfile is correctly imported via useAuth
      await fetchUserProfile(); 
      
      // 3. Redirect
      router.push('/');
      
    } catch (err: any) {
      console.error('Full signup error:', err);

      if (!err.response) {
        setError('Network error — unable to reach the server.');
        return;
      }

      // Extract error from backend response (e.g., "User already exists")
      const errMsg = err.response.data?.error || 'Registration failed. Check console for details.';
      setError(errMsg);

      console.error('Signup Error Details:', err.response.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Class for consistent, visible input styling
  const inputClass =
    'w-full px-3 py-2 mt-1 border rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Create New Account
        </h2>

        <form className="space-y-4" onSubmit={handleSignup}>
          {error && (
            <p className="p-2 text-red-700 text-sm text-center bg-red-100 border border-red-300 rounded-md">
              {error}
            </p>
          )}

          {/* Row 1: Name and Age */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input id="name" name="name" type="text" required onChange={handleChange} disabled={loading} className={inputClass} />
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
              <input id="age" name="age" type="number" required onChange={handleChange} disabled={loading} min="18" className={inputClass} />
            </div>
          </div>
          
          {/* Row 2: Email and Mobile */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (Optional)</label>
              <input id="email" name="email" type="email" onChange={handleChange} disabled={loading} className={inputClass} />
            </div>
            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile (Optional)</label>
              <input id="mobile" name="mobile" type="tel" onChange={handleChange} disabled={loading} className={inputClass} />
            </div>
          </div>

          {/* Row 3: Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <input id="address" name="address" type="text" required onChange={handleChange} disabled={loading} className={inputClass} />
          </div>

          {/* Row 4: Aadhar Card Number */}
          <div>
            <label htmlFor="aadharCardNumber" className="block text-sm font-medium text-gray-700">Aadhar Card Number (12 Digits)</label>
            <input id="aadharCardNumber" name="aadharCardNumber" type="text" required onChange={handleChange} disabled={loading} minLength={12} maxLength={12} className={inputClass} />
          </div>

          {/* Row 5: Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input id="password" name="password" type="password" required onChange={handleChange} disabled={loading} className={inputClass} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-400 font-semibold transition duration-150"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
