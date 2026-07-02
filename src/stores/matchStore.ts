import { create } from 'zustand';
import type { Decision, ActivityLog } from '../types';

interface MatchState {
  decisionHistory: Decision[];
  activityLogs: ActivityLog[];
  feedbackRatings: Record<string, 'Excellent' | 'Good' | 'Poor'>; // Key format: `${clientId}_${matchId}`
  
  addDecision: (decision: Omit<Decision, 'id' | 'date'>) => void;
  addActivityLog: (clientId: string, clientName: string, type: ActivityLog['type'], description: string) => void;
  setFeedbackRating: (clientId: string, matchId: string, rating: 'Excellent' | 'Good' | 'Poor') => void;
  loadDecisionData: () => void;
}

// Initial mock decision log history for dashboard metrics
const initialDecisions: Decision[] = [
  {
    id: "DEC-2026-001",
    clientId: "TDC-2026-001",
    clientName: "Arjun Mehta",
    matchId: "TDC-2026-102",
    matchName: "Sneha Sen",
    status: "Sent",
    date: "2026-07-01",
    timeTaken: "2 days",
    aiScore: 92,
    outcome: "Accepted",
    notes: "Both families are open to meeting in Mumbai next week."
  },
  {
    id: "DEC-2026-002",
    clientId: "TDC-2026-001",
    clientName: "Arjun Mehta",
    matchId: "TDC-2026-103",
    matchName: "Neha Verma",
    status: "Rejected",
    date: "2026-06-28",
    timeTaken: "4 days",
    aiScore: 78,
    outcome: "Rejected",
    notes: "Family preferred candidate with higher location flexibility."
  },
  {
    id: "DEC-2026-003",
    clientId: "TDC-2026-002",
    clientName: "Kabir Sharma",
    matchId: "TDC-2026-107",
    matchName: "Meera Menon",
    status: "Sent",
    date: "2026-06-30",
    timeTaken: "1 day",
    aiScore: 95,
    outcome: "Pending",
    notes: "Proposal sent to Kabir's parents. Waiting for confirmation."
  },
  {
    id: "DEC-2026-004",
    clientId: "TDC-2026-003",
    clientName: "Rohan Deshmukh",
    matchId: "TDC-2026-104",
    matchName: "Anjali Desai",
    status: "Sent",
    date: "2026-06-29",
    timeTaken: "3 days",
    aiScore: 84,
    outcome: "Accepted",
    notes: "Meeting scheduled over Zoom this coming Sunday."
  }
];

// Initial mock activity log feed for dashboard
const initialActivityLogs: ActivityLog[] = [
  {
    id: "ACT-001",
    clientId: "TDC-2026-001",
    clientName: "Arjun Mehta",
    timestamp: "2026-07-02T09:12:00",
    type: "note_added",
    description: "Meeting notes added: Discussed career and relocation goals."
  },
  {
    id: "ACT-002",
    clientId: "TDC-2026-001",
    clientName: "Arjun Mehta",
    timestamp: "2026-07-02T09:30:00",
    type: "accepted",
    description: "Match Accepted: Arjun and Sneha Sen agreed to initiate chat."
  },
  {
    id: "ACT-003",
    clientId: "TDC-2026-002",
    clientName: "Kabir Sharma",
    timestamp: "2026-07-02T10:05:00",
    type: "stage_changed",
    description: "Journey stage updated: Consultation → Matching."
  },
  {
    id: "ACT-004",
    clientId: "TDC-2026-003",
    clientName: "Rohan Deshmukh",
    timestamp: "2026-07-02T11:40:00",
    type: "match_sent",
    description: "Proposal Sent: Rohan and Anjali Desai's profile shared."
  }
];

export const useMatchStore = create<MatchState>((set) => ({
  decisionHistory: (() => {
    const raw = localStorage.getItem('tdc_decision_history');
    return raw ? JSON.parse(raw) : initialDecisions;
  })(),

  activityLogs: (() => {
    const raw = localStorage.getItem('tdc_activity_logs');
    return raw ? JSON.parse(raw) : initialActivityLogs;
  })(),

  feedbackRatings: (() => {
    const raw = localStorage.getItem('tdc_feedback_ratings');
    return raw ? JSON.parse(raw) : {};
  })(),

  loadDecisionData: () => {
    const decs = localStorage.getItem('tdc_decision_history');
    const logs = localStorage.getItem('tdc_activity_logs');
    const ratings = localStorage.getItem('tdc_feedback_ratings');
    set({
      decisionHistory: decs ? JSON.parse(decs) : initialDecisions,
      activityLogs: logs ? JSON.parse(logs) : initialActivityLogs,
      feedbackRatings: ratings ? JSON.parse(ratings) : {}
    });
  },

  addDecision: (decision) => {
    set((state) => {
      const newDecision: Decision = {
        ...decision,
        id: `DEC-2026-${String(state.decisionHistory.length + 1).padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0]
      };
      const updated = [newDecision, ...state.decisionHistory];
      localStorage.setItem('tdc_decision_history', JSON.stringify(updated));
      return { decisionHistory: updated };
    });
  },

  addActivityLog: (clientId, clientName, type, description) => {
    set((state) => {
      const newLog: ActivityLog = {
        id: `ACT-${String(state.activityLogs.length + 1).padStart(3, '0')}`,
        clientId,
        clientName,
        timestamp: new Date().toISOString(),
        type,
        description
      };
      const updated = [newLog, ...state.activityLogs];
      localStorage.setItem('tdc_activity_logs', JSON.stringify(updated));
      return { activityLogs: updated };
    });
  },

  setFeedbackRating: (clientId, matchId, rating) => {
    set((state) => {
      const key = `${clientId}_${matchId}`;
      const updated = { ...state.feedbackRatings, [key]: rating };
      localStorage.setItem('tdc_feedback_ratings', JSON.stringify(updated));
      return { feedbackRatings: updated };
    });
  }
}));
