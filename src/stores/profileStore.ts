import { create } from 'zustand';
import type { Profile } from '../types';
import maleData from '../data/male.json';
import femaleData from '../data/female.json';

interface ProfileState {
  profiles: Profile[];
  selectedProfileId: string | null;
  loadProfiles: () => void;
  setSelectedProfileId: (id: string | null) => void;
  updateProfileStage: (id: string, stage: Profile['stage']) => void;
  updateProfile: (updated: Profile) => void;
  getSelectedProfile: () => Profile | null;
}

// Combine static JSON profiles on startup
const initialProfiles = [...(maleData as Profile[]), ...(femaleData as Profile[])];

export const useProfileStore = create<ProfileState>((set, get) => ({
  profiles: initialProfiles,
  selectedProfileId: null,

  loadProfiles: () => {
    // Already pre-loaded, but resets if needed
    set({ profiles: initialProfiles });
  },

  setSelectedProfileId: (id) => {
    set({ selectedProfileId: id });
  },

  updateProfileStage: (id, stage) => {
    set((state) => ({
      profiles: state.profiles.map((p) =>
        p.id === id ? { ...p, stage } : p
      ),
    }));
  },

  updateProfile: (updated) => {
    set((state) => ({
      profiles: state.profiles.map((p) =>
        p.id === updated.id ? updated : p
      ),
    }));
  },

  getSelectedProfile: () => {
    const { profiles, selectedProfileId } = get();
    if (!selectedProfileId) return null;
    return profiles.find((p) => p.id === selectedProfileId) || null;
  },
}));
