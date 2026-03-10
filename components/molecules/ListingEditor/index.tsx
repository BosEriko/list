"use client";
import { useState, useEffect } from "react";
import useAuthStore from '@store/useAuthStore';
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@lib/Firebase";
import Atom from "@atom";

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
  const [currentTitle, setCurrentTitle] = useState(title);
  const [currentCount, setCurrentCount] = useState(count);
  const [currentTotalCount, setCurrentTotalCount] = useState(totalCount);
  const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [existingCreatedAt, setExistingCreatedAt] = useState<any>(null);

  const docId = `${userId}-${type}-${itemId}`;
  const listingRef = doc(db, "listings", docId);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchListing = async () => {
      const docSnap = await getDoc(listingRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStatus(data.status ?? 1);
        setCurrentTitle(data.title ?? title);
        setCurrentCount(data.count ?? count);
        setCurrentTotalCount(data.totalCount ?? totalCount);
        setCurrentImageUrl(data.imageUrl ?? imageUrl);
        setExistingCreatedAt(data.createdAt ?? null);
      } else {
        setStatus(1);
        setCurrentTitle(title);
        setCurrentCount(count);
        setCurrentTotalCount(totalCount);
        setCurrentImageUrl(imageUrl);
        setExistingCreatedAt(null);
      }
    };

    fetchListing();
  }, [isOpen, userId]);

  const handleSave = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      await setDoc(listingRef, {
        userId,
        itemId,
        type,
        title: currentTitle,
        count: currentCount,
        totalCount: currentTotalCount,
        imageUrl: currentImageUrl,
        status,
        createdAt: existingCreatedAt ?? serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setSuccess(true);
      setTimeout(() => setIsOpen(false), 1000);
    } catch (err) {
      console.error("Error adding/updating listing:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Atom.Visibility state={user !== null}>
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
              <strong>Title:</strong>{" "}
              <input
                type="text"
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              />
            </div>

            <div className="mb-2">
              <strong>Type:</strong> {type}
            </div>

            <div className="mb-2">
              <strong>Count:</strong>{" "}
              <input
                type="number"
                value={currentCount}
                onChange={(e) => setCurrentCount(Number(e.target.value))}
                className="border rounded px-2 py-1 w-full"
              />
            </div>

            <div className="mb-2">
              <strong>Total Count:</strong>{" "}
              <input
                type="number"
                value={currentTotalCount}
                onChange={(e) => setCurrentTotalCount(Number(e.target.value))}
                className="border rounded px-2 py-1 w-full"
              />
            </div>

            <div className="mb-2">
              <strong>Image URL:</strong>{" "}
              <input
                type="text"
                value={currentImageUrl}
                onChange={(e) => setCurrentImageUrl(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              />
            </div>

            <div className="mb-4">
              <strong>Status:</strong>{" "}
              <select
                value={status}
                onChange={(e) => setStatus(Number(e.target.value))}
                className="border rounded px-2 py-1 w-full"
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
    </Atom.Visibility>
  );
};

export default ListingEditor;
