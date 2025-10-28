// types/index.ts

// The User object structure fetched from the backend (e.g., GET /user/profile)
export interface User {
  _id: string;
  name: string;
  age: number;
  address: string;
  aadharCardNumber: number; // Important: Stored as number in DB [cite: uploaded:prince-1501/voting_app/voting_app-0de0d254cc6d0f1233fbc056a240e7bb10b23326/models/user.js]
  role: 'voter' | 'admin'; // User roles [cite: uploaded:prince-1501/voting_app/voting_app-0de0d254cc6d0f1233fbc056a240e7bb10b23326/models/user.js]
  isVoted: boolean; // Voting status [cite: uploaded:prince-1501/voting_app/voting_app-0de0d254cc6d0f1233fbc056a240e7bb10b23326/models/user.js]
  email?: string; // Optional field
  mobile?: string; // Optional field
}

// Data structure for the Candidate list (GET /candidate)
// Note: Backend public route only returns name and party [cite: uploaded:prince-1501/voting_app/voting_app-0de0d254cc6d0f1233fbc056a240e7bb10b23326/routes/candidateRoutes.js]
export interface Candidate {
  name: string;
  party: string;
}

// Data structure for Vote Counts (GET /candidate/vote/count) [cite: uploaded:prince-1501/voting_app/voting_app-0de0d254cc6d0f1233fbc056a240e7bb10b23326/routes/candidateRoutes.js]
export interface VoteRecord {
  party: string;
  count: number;
}
