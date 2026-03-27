"use client";
import useListingStore from "@store/useListingStore";
import MediaType from "@type/MediaType";
import MEDIA from "@constant/MEDIA"

const typeOptions: MediaType[] = MEDIA;

export default function ListingType() {
  const { type, setType, listings } = useListingStore();

  return (
    <div className="flex gap-2 mb-2">
      {typeOptions.map((t) => {
        const count = listings.filter((l) => l.type === t).length;
        return (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`cursor-pointer px-3 py-1 rounded-md text-sm ${
              type === t ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)} ({count})
          </button>
        );
      })}
    </div>
  );
}
