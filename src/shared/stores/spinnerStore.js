import { create } from 'zustand';

export const useSpinnerStore = create((set) => ({
  loading: false,
  setLoading: (state) => set({ loading: state }),
}));
