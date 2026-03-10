"use client";
import { useState } from "react";
import useAuthStore from '@store/useAuthStore';
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@lib/Firebase";

interface IListingEditorProps {
  itemId: string;
  type: string;
  title: string;
  count: number;
  totalCount: number;
  imageUrl: string;
}

const statusOptions = [
  { value: 0, label: "Dropped" },
  { value: 1, label: "Watching" },
  { value: 2, label: "Plan to watch" },
  { value: 3, label: "Completed" },
  { value: 4, label: "Rewatching" },
  { value: 5, label: "Paused" },
];

const ListingEditor: React.FC<IListingEditorProps> = ({
  itemId,
  type,
  title,
  count,
  totalCount,
  imageUrl,
}) => {
  const { user } = useAuthStore();
  const userId = user?.uid;
  const [status, setStatus] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = async () => {
    const docId = `${userId}-${type}-${itemId}`;
    setLoading(true);
    try {
      await setDoc(doc(db, "listings", docId), {
        userId,
        itemId,
        type,
        title,
        count,
        totalCount,
        imageUrl,
        status,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setSuccess(true);
      setTimeout(() => setIsOpen(false), 1000);
    } catch (err) {
      console.error("Error adding listing:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        + Add to List
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="font-bold text-lg mb-4">Add to Listing</h2>
            <div className="mb-2">
              <strong>Title:</strong> {title}
            </div>
            <div className="mb-2">
              <strong>Type:</strong> {type}
            </div>
            <div className="mb-2">
              <strong>Count:</strong> {count}
            </div>
            <div className="mb-4">
              <strong>Status:</strong>{" "}
              <select
                value={status}
                onChange={(e) => setStatus(Number(e.target.value))}
                className="border rounded px-2 py-1"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              {loading ? "Saving..." : "Save Listing"}
            </button>
            {success && (
              <div className="text-green-600 mt-2 text-center">
                Saved successfully!
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ListingEditor;
