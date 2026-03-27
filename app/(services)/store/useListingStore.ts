'use client';
import { create } from 'zustand';

type ListingType = "anime" | "manga" | "game";

export interface Listing {
  count: number;
  imageUrl: string;
  itemId: string;
  listingUrl: string;
  status: number;
  title: string;
  totalCount: number | null;
  type: ListingType;
  userId: string;
  isOngoing?: boolean;
}

type ListingState = {
  status: number;
  type: ListingType;
  listings: Listing[];

  setStatus: (status: number) => void;
  setType: (type: ListingType) => void;
  setListings: (listings: Listing[]) => void;

  reset: () => void;
};

const DEFAULT_STATUS = 1;
const DEFAULT_TYPE: ListingType = 'anime';

const useListingStore = create<ListingState>((set) => ({
  status: DEFAULT_STATUS,
  type: DEFAULT_TYPE,
  listings: [],

  setStatus: (status) => set({ status }),
  setType: (type) => set({ type }),
  setListings: (listings) => set({ listings }),

  reset: () => set({ status: DEFAULT_STATUS, type: DEFAULT_TYPE, listings: [] }),
}));

export default useListingStore;
