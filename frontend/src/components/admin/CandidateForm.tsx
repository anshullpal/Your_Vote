// components/admin/CandidateForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { Candidate } from '@/types'; 
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Extended type including the ID for update operations
interface AdminCandidateForm extends Candidate {
    _id?: string;
    age: number; // Age is required by the backend model
}

interface CandidateFormProps {
    initialData?: AdminCandidateForm;
    onSuccess: () => void;
    mode: 'create' | 'update';
}

const initialFormState: AdminCandidateForm = {
    name: '',
    party: '',
    age: 18,
};

const CandidateForm = ({ initialData, onSuccess, mode }: CandidateFormProps) => {
    const [formData, setFormData] = useState<AdminCandidateForm>(initialData || initialFormState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Populate form data if in update mode
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.name === 'age' ? Number(e.target.value) : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (mode === 'create') {
                // POST /candidate
                await api.post('/candidate', formData);
                alert('Candidate created successfully!');
            } else {
                // PUT /candidate/:candidateID
                await api.put(`/candidate/${formData._id}`, formData);
                alert('Candidate updated successfully!');
            }
            onSuccess(); // Run success callback (e.g., refresh list, navigate)
        } catch (err: any) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Operation failed.');
        } finally {
            setLoading(false);
        }
    };

    const buttonText = mode === 'create' ? 'Create Candidate' : 'Update Candidate';

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="p-3 mb-4 text-sm font-medium text-red-800 bg-red-50 rounded-lg">{error}</p>}
            
            {/* Form Fields */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} 
                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
                <label htmlFor="party" className="block text-sm font-medium text-gray-700">Party</label>
                <input type="text" name="party" id="party" required value={formData.party} onChange={handleChange} 
                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                <input type="number" name="age" id="age" required min="18" value={formData.age} onChange={handleChange} 
                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                            ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'} 
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
                {loading ? <LoadingSpinner size="sm" /> : buttonText}
            </button>
        </form>
    );
};

export default CandidateForm;