// app/voter/page.tsx
'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { Candidate } from '@/types'; // Import Candidate interface

// For this view, we need the Candidate ID for voting.
// Since GET /candidate only returns name and party, we assume the backend has an
// extension or that we manually combine data (as we did for the admin view)
// to get the ID required for the vote endpoint.
interface CandidateWithId extends Candidate {
    _id: string; // The ID of the candidate document
}

const VoterDashboard = () => {
  const [candidates, setCandidates] = useState<CandidateWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVoted, setIsVoted] = useState(false); // Local state to mirror user.isVoted

  useEffect(() => {
    const fetchVoterData = async () => {
      try {
        // 1. Fetch Candidate List (GET /candidate)
        const candidatesRes = await api.get('/candidate'); 
        
        // 2. Fetch User Profile to get isVoted status
        const profileRes = await api.get('/user/profile');
        setIsVoted(profileRes.data.user.isVoted);
        
        // SIMULATION: Since GET /candidate lacks _id, we must mock/combine data.
        // In a real application, you'd ensure this GET route returns the _id.
        const candidatesWithIds: CandidateWithId[] = candidatesRes.data.map((c: Candidate, index: number) => ({
            ...c,
            _id: `mock-id-${index+1}`, // Mocking the required _id
        }));

        setCandidates(candidatesWithIds);
        setLoading(false);
      } catch (err: any) {
        setError('Failed to load data. Please log in again.');
        setLoading(false);
      }
    };
    fetchVoterData();
  }, []);


  const handleVote = async (candidateID: string, candidateName: string) => {
    if (isVoted) {
      alert('You have already cast your vote. You cannot vote again.'); // Backend check
      return;
    }

    if (!window.confirm(`Are you sure you want to vote for ${candidateName}? This action cannot be undone.`)) {
        return;
    }

    try {
      // API call to cast the vote (GET /candidate/vote/:candidateID)
      await api.get(`/candidate/vote/${candidateID}`);
      
      setIsVoted(true); // Update local state immediately
      alert(`Successfully voted for ${candidateName}. Thank you!`);

    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Vote failed. You might have already voted.';
      alert(errMsg);
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-8">Fetching candidates...</p>;
  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-extrabold text-gray-900">Cast Your Vote</h2>
      
      {isVoted ? (
        <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          <p className="font-bold">Thank you!</p>
          <p>You have already cast your vote and cannot vote again.</p>
        </div>
      ) : (
        <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
          <p className="font-bold">Voter Status: Eligible</p>
          <p>Select your preferred candidate below.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((candidate) => (
          <div key={candidate._id} className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-indigo-500">
            <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
            <p className="mt-1 text-lg text-gray-600">Party: {candidate.party}</p>
            
            <button
              onClick={() => handleVote(candidate._id, candidate.name)}
              disabled={isVoted}
              className={`mt-4 w-full py-2 px-4 rounded-md text-white font-medium 
                          ${isVoted 
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`
                        }
            >
              {isVoted ? 'Voted' : 'Vote Now'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoterDashboard;