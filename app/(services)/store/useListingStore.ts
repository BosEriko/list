'use client';
import { create } from 'zustand';
import MediaType from "@type/MediaType";

export interface Listing {
  count: number;
  imageUrl: string;
  itemId: string;
  listingUrl: string;
  status: number;
  title: string;
  totalCount: number | null;
  type: MediaType;
  userId: string;
  isOngoing?: boolean;
}

type ListingState = {
  status: number;
  type: MediaType;
  listings: Listing[];

  setStatus: (status: number) => void;
  setType: (type: MediaType) => void;
  setListings: (listings: Listing[]) => void;

  reset: () => void;
};

const DEFAULT_STATUS = 1;
const DEFAULT_TYPE: MediaType = 'anime';

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
