// app/admin/(candidates)/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';

// Defined based on the Candidate Model requirements
interface CandidateFormState {
  name: string;
  party: string;
  age: number;
}

const initialFormState: CandidateFormState = {
  name: '',
  party: '',
  age: 18, // Minimum age for a candidate
};

const CreateCandidatePage = () => {
  const [formData, setFormData] = useState<CandidateFormState>(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.name === 'age' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // POST route to add a candidate (Admin only)
      const response = await api.post('/candidate', formData);
      
      alert(`Candidate ${response.data.response.name} created successfully!`);
      router.push('/admin/candidates'); // Navigate back to the list
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to create candidate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-xl rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Add New Candidate</h2>
      
      {error && <p className="p-3 mb-4 text-sm font-medium text-red-800 bg-red-50 rounded-lg">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* Party Input */}
        <div>
          <label htmlFor="party" className="block text-sm font-medium text-gray-700">Party</label>
          <input
            type="text"
            name="party"
            id="party"
            required
            value={formData.party}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* Age Input */}
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
          <input
            type="number"
            name="age"
            id="age"
            required
            min="18"
            value={formData.age}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                      ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} 
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
        >
          {loading ? 'Creating...' : 'Create Candidate'}
        </button>
      </form>
    </div>
  );
};

export default CreateCandidatePage;