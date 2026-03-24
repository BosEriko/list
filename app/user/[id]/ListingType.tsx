"use client";
import ListingStatusOptions from '@constant/ListingStatusOptions';
import useListingStore from "@store/useListingStore";

const typeOptions: Array<"anime" | "manga" | "game" | "movie"> = ["anime", "manga", "game", "movie"];

export default function ListingType() {
  const { type, setType } = useListingStore();

  return (
    <div className="flex gap-2 mb-2">
      {/* TODO: Remove "game" and "movie" filter when they are available */}
      {typeOptions.filter((t) => t !== "game" && t !== "movie").map((t) => (
        <button
          key={t}
          onClick={() => setType(t)}
          className={`cursor-pointer px-3 py-1 rounded-md text-sm ${type === t ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  );
}
