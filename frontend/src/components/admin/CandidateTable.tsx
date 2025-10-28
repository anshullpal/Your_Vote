// components/admin/CandidateTable.tsx
'use client';

import React from 'react';
import api from '@/utils/api';

// Reusing the Candidate interface with ID and full details
interface AdminCandidate {
    _id: string;
    name: string;
    party: string;
    age: number;
    voteCount: number;
}

interface CandidateTableProps {
    candidates: AdminCandidate[];
    onCandidateDeleted: () => void;
}

const CandidateTable = ({ candidates, onCandidateDeleted }: CandidateTableProps) => {

    const handleDelete = async (candidateID: string, candidateName: string) => {
        if (!window.confirm(`Are you sure you want to delete ${candidateName}?`)) return;

        try {
            // DELETE /candidate/:candidateID
            await api.delete(`/candidate/${candidateID}`);
            alert('Candidate deleted successfully!');
            onCandidateDeleted(); // Trigger a data refresh in the parent component
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to delete candidate.');
        }
    };

    return (
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
                                {/* Note: Update functionality would typically link to an edit page */}
                                <button 
                                    onClick={() => handleDelete(candidate._id, candidate.name)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CandidateTable;