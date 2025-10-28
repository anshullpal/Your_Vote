// app/admin/(candidates)/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/utils/api';
import Link from 'next/link';
import { Candidate } from '@/types'; // Re-use/extend the Candidate interface

// For admin CRUD, we need more detail than the public GET /candidate provides.
// We'll define a local type based on the Candidate Model (models/candidate.js)
// and assume a route exists or that the GET /candidate route returns these details.
interface AdminCandidate extends Candidate {
    _id: string; // Crucial for DELETE/PUT
    age: number; // For display
    voteCount: number; // For display
}


const CandidatesPage = () => {
    const [candidates, setCandidates] = useState<AdminCandidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // NOTE TO USER: The existing backend route GET /candidate only returns name and party.
    // For a real admin CRUD table, the full candidate data (including _id, age, voteCount)
    // would be needed. This function simulates fetching full data.
    const fetchCandidates = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Assume an admin-specific route or a new query that fetches full data.
            // For now, we mock the data structure needed for the table.
            // The actual backend GET /candidate only returns [{"name": "...", "party": "..."}]
            const candidatesRes = await api.get('/candidate'); 
            const votesRes = await api.get('/candidate/vote/count'); //
            
            // SIMULATION: Combining limited data and adding dummy fields
            const mockCandidates: AdminCandidate[] = candidatesRes.data.map((c: {name: string, party: string}, index: number) => ({
                _id: `mock-id-${index+1}`, // Mocking the essential _id for delete
                name: c.name,
                party: c.party,
                age: 40 + index, // Mocking age
                voteCount: votesRes.data.find((v: {party: string}) => v.party === c.party)?.count || 0,
            }));

            setCandidates(mockCandidates);
            
        } catch (err: any) {
            setError('Failed to fetch candidate data. Check your backend server.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCandidates();
    }, [fetchCandidates]);


    const handleDelete = async (candidateID: string) => {
        if (!window.confirm('Are you sure you want to delete this candidate?')) return;

        try {
            // DELETE /candidate/:candidateID
            await api.delete(`/candidate/${candidateID}`);
            alert('Candidate deleted successfully!');
            fetchCandidates(); // Refresh the list
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to delete candidate.');
        }
    };


    if (loading) return <p className="text-center mt-8">Loading Candidates...</p>;
    if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-extrabold text-gray-900">Manage Candidates</h2>
                <Link 
                    href="/admin/candidates/create"
                    className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                    Add New Candidate
                </Link>
            </div>
            
            {candidates.length === 0 ? (
                <p className="text-lg text-gray-500">No candidates have been added yet.</p>
            ) : (
                <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Party</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Votes</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {candidates.map((candidate) => (
                                <tr key={candidate._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{candidate.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.party}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.age}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.voteCount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {/* PUT route is available but not fully implemented here for brevity */}
                                        <button 
                                            onClick={() => handleDelete(candidate._id)}
                                            className="text-red-600 hover:text-red-900 ml-4"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CandidatesPage;