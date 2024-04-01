import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';

interface Store {
  user: User | null;
  setUser: (user: User) => void;
}

export const useStore = create<Store>((set) => ({
  user: null,
  setUser: (user: User) => set(() => ({ user })),
}));
