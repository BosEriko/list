"use client";
import ListingStatusOptions from '@constant/ListingStatusOptions';
import useListingStore from "@store/useListingStore";

export default function ListingStatus() {
  const { type, status, setStatus } = useListingStore();

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {ListingStatusOptions[type].map((s) => (
        <button
          key={s.value}
          onClick={() => setStatus(s.value)}
          className={`cursor-pointer px-3 py-1 rounded-md text-sm ${status === s.value ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
