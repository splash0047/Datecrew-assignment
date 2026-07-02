export interface ProfileVerification {
  identity: 'Verified' | 'Pending' | 'Failed';
  phone: 'Verified' | 'Pending' | 'Failed';
  email: 'Verified' | 'Pending' | 'Failed';
  income: 'Verified' | 'Pending' | 'Failed';
  education: 'Verified' | 'Pending' | 'Failed';
}

export interface Profile {
  id: string; // e.g., TDC-2026-001
  firstName: string;
  lastName: string;
  fullName: string;
  gender: 'Male' | 'Female';
  dob: string; // YYYY-MM-DD
  age: number;
  city: string;
  country: string;
  height: string; // e.g., 178 cm, 5'10"
  heightCm: number; // numeric value for comparative logic
  email: string;
  phone: string;
  college: string;
  degree: string;
  income: number; // In LPA (Lakhs Per Annum)
  company: string;
  designation: string;
  maritalStatus: 'Never Married' | 'Divorced' | 'Widowed' | 'Awaiting Divorce';
  languages: string[];
  siblings: string;
  caste: string;
  religion: string;
  wantKids: 'Yes' | 'No' | 'Maybe';
  openToRelocate: 'Yes' | 'No' | 'Maybe';
  openToPets: 'Yes' | 'No' | 'Maybe';
  lifestyle: string;
  hobbies: string[];
  preferredFamilyType: 'Joint' | 'Nuclear' | 'Both';
  diet: 'Vegetarian' | 'Non-Vegetarian' | 'Eggitarian' | 'Vegan';
  smoking: 'Yes' | 'No' | 'Occasionally';
  drinking: 'Yes' | 'No' | 'Occasionally';
  weekendPreference: string;
  travelFrequency: string;
  fitnessLevel: string;
  workStyle: 'Remote' | 'Hybrid' | 'Office';
  profileCompleteness: number; // 0-100
  missingFields: string[];
  verificationStatus: ProfileVerification;
  avatar: string; // URL path or base64 representation
  aboutMe: string; // Short bio narrative
  stage: 'Verified' | 'Consultation' | 'Matching' | 'Meeting' | 'Closed';
}

export interface Decision {
  id: string;
  clientId: string;
  clientName: string;
  matchId: string;
  matchName: string;
  status: 'Sent' | 'Rejected';
  date: string; // YYYY-MM-DD
  timeTaken: string; // e.g. "2 days"
  aiScore: number;
  outcome: 'Accepted' | 'Pending' | 'Rejected';
  notes: string;
}

export interface Note {
  id: string;
  clientId: string;
  date: string;
  outcome: 'Positive' | 'Neutral' | 'Concern';
  nextAction: string;
  mood: '😊' | '😐' | '😟' | 'Positive' | 'Neutral' | 'Concern';
  priority: 'High' | 'Medium' | 'Low';
  reminderDate?: string;
  summary: string;
  tags: string[];
}

export interface ActivityLog {
  id: string;
  clientId: string;
  clientName: string;
  timestamp: string; // YYYY-MM-DDTHH:MM:SS
  type: 'match_sent' | 'note_added' | 'meeting' | 'accepted' | 'rejected' | 'stage_changed';
  description: string;
}

export interface MatchExplanation {
  score: number;
  reasons: string[];
  missingData: string[];
  confidence: 'High' | 'Medium' | 'Low';
  confidenceReason: string;
  recommendation: string;
  nextStep: string;
}

export interface SearchFilters {
  query: string;
  city?: string;
  profession?: string;
  diet?: string;
  wantsKids?: boolean;
  minAge?: number;
  maxAge?: number;
}
