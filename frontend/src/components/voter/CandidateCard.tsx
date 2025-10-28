// components/voter/CandidateCard.tsx
'use client';

import React, { useState } from 'react';
import api from '@/utils/api';
import { Candidate } from '@/types';

// Extended type to include the ID needed for the vote endpoint
interface CandidateCardProps {
    candidate: Candidate & { _id: string }; 
    isVoted: boolean;
    onVoteSuccess: () => void;
}

const CandidateCard = ({ candidate, isVoted, onVoteSuccess }: CandidateCardProps) => {
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const handleVote = async () => {
        if (isVoted) return;

        if (!window.confirm(`Confirm your vote for ${candidate.name}? This action is final.`)) {
            return;
        }

        setLoading(true);
        setLocalError(null);

        try {
            // API call to cast the vote (GET /candidate/vote/:candidateID)
            await api.get(`/candidate/vote/${candidate._id}`);
            
            alert(`Vote recorded for ${candidate.name}.`);
            onVoteSuccess(); // Trigger parent state update (e.g., refresh isVoted status)

        } catch (err: any) {
            const errMsg = err.response?.data?.message || 'Vote failed. You might have already voted.';
            setLocalError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg transition duration-300 hover:shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900">{candidate.name}</h3>
            <p className="mt-1 text-xl text-indigo-600">Party: {candidate.party}</p>
            
            {localError && <p className="mt-3 text-red-500 text-sm font-medium">{localError}</p>}

            <button
              onClick={handleVote}
              disabled={isVoted || loading}
              className={`mt-4 w-full py-2 px-4 rounded-md text-white font-medium transition duration-150 
                          ${isVoted 
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`
                        }
            >
              {loading 
                ? <LoadingSpinner size="sm" /> 
                : (isVoted ? 'Voted' : 'Vote Now')}
            </button>
        </div>
    );
};

export default CandidateCard;