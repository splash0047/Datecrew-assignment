import { create } from 'zustand';
import type { Note } from '../types';

interface NoteState {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'date'>) => void;
  deleteNote: (id: string) => void;
  getNotesForClient: (clientId: string) => Note[];
}

const initialNotes: Note[] = [
  {
    id: "N-001",
    clientId: "TDC-2026-001",
    date: "2026-07-02",
    outcome: "Positive",
    nextAction: "Generate matches of career-focused individuals.",
    mood: "😊",
    priority: "High",
    reminderDate: "2026-07-05",
    summary: "Had a detailed onboarding call. Client seeks a software engineer or product manager settled in Pune or open to relocation. Prefers nuclear family structures, and is values-driven.",
    tags: ["Career", "Preferences", "Family"]
  },
  {
    id: "N-002",
    clientId: "TDC-2026-001",
    date: "2026-07-01",
    outcome: "Neutral",
    nextAction: "Verify salary documents.",
    mood: "😐",
    priority: "Medium",
    summary: "Followed up on incomplete income documentation. Client promised to upload pay slips by Friday.",
    tags: ["Documents", "Finance"]
  }
];

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: (() => {
    const raw = localStorage.getItem('tdc_notes');
    return raw ? JSON.parse(raw) : initialNotes;
  })(),

  addNote: (note) => {
    set((state) => {
      const newNote: Note = {
        ...note,
        id: `N-${String(state.notes.length + 1).padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0]
      };
      const updated = [newNote, ...state.notes];
      localStorage.setItem('tdc_notes', JSON.stringify(updated));
      return { notes: updated };
    });
  },

  deleteNote: (id) => {
    set((state) => {
      const updated = state.notes.filter((n) => n.id !== id);
      localStorage.setItem('tdc_notes', JSON.stringify(updated));
      return { notes: updated };
    });
  },

  getNotesForClient: (clientId) => {
    return get().notes.filter((n) => n.clientId === clientId);
  }
}));
