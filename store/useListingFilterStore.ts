'use client';
import { create } from 'zustand';

type ListingType = 'anime' | 'manga' | 'game' | 'movie';

type ListingFilterState = {
  status: number | null;
  type: ListingType | null;

  setStatus: (status: number | null) => void;
  setType: (type: ListingType | null) => void;

  reset: () => void;
};

const DEFAULT_STATUS = 1;
const DEFAULT_TYPE = "anime";

const useListingFilterStore = create<ListingFilterState>((set) => ({
  status: DEFAULT_STATUS,
  type: DEFAULT_TYPE,

  setStatus: (status) => set({ status }),
  setType: (type) => set({ type }),

  reset: () => set({ status: DEFAULT_STATUS, type: DEFAULT_TYPE }),
}));

export default useListingFilterStore;
