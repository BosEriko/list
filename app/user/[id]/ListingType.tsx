"use client";
import useListingStore from "@store/useListingStore";

const typeOptions: Array<"anime" | "manga" | "game"> = ["anime", "manga", "game"];

export default function ListingType() {
  const { type, setType, listings } = useListingStore();

  return (
    <div className="flex gap-2 mb-2">
      {/* TODO: Remove "game" filter when it's available */}
      {typeOptions.filter((t) => t !== "game").map((t) => {
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
