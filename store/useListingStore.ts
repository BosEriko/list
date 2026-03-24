'use client';
import { create } from 'zustand';

type ListingType = 'anime' | 'manga' | 'game' | 'movie';

type ListingState = {
  status: number;
  type: ListingType;

  setStatus: (status: number) => void;
  setType: (type: ListingType) => void;

  reset: () => void;
};

const DEFAULT_STATUS = 1;
const DEFAULT_TYPE = "anime";

const useListingStore = create<ListingState>((set) => ({
  status: DEFAULT_STATUS,
  type: DEFAULT_TYPE,

  setStatus: (status) => set({ status }),
  setType: (type) => set({ type }),

  reset: () => set({ status: DEFAULT_STATUS, type: DEFAULT_TYPE }),
}));

export default useListingStore;
