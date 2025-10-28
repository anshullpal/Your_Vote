// app/admin/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { VoteRecord } from '@/types'; // Use the VoteRecord interface from Step 2

const AdminDashboard = () => {
  const [voteCounts, setVoteCounts] = useState<VoteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVoteCounts = async () => {
      try {
        // Fetch vote counts sorted by count (desc)
        const response = await api.get('/candidate/vote/count');
        setVoteCounts(response.data);
        setLoading(false);
      } catch (err: any) {
        setError('Failed to fetch vote counts.');
        setLoading(false);
      }
    };
    fetchVoteCounts();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading live vote results...</p>;
  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-extrabold text-gray-900">Live Election Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {voteCounts.map((record) => (
          <div key={record.party} className="p-6 bg-white rounded-xl shadow-lg border-l-4 border-indigo-500">
            <p className="text-lg font-semibold text-gray-500">{record.party}</p>
            <p className="mt-1 text-4xl font-bold text-gray-900">{record.count}</p>
          </div>
        ))}
      </div>
      
      {voteCounts.length === 0 && (
          <p className="text-lg text-gray-500">No candidates found or no votes cast yet.</p>
      )}

      <div className="mt-10 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold">Quick Actions</h3>
          <Link href="/admin/candidates/create" 
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
              + Add New Candidate
          </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;