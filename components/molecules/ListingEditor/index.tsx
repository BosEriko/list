"use client";
import { useState, useEffect } from "react";
import useAuthStore from "@store/useAuthStore";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@lib/Firebase";
import Atom from "@atom";

interface IListingEditorProps {
  itemId: string;
  type: string;
  title: string;
  count: number;
  totalCount: number | null;
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

  const [form, setForm] = useState({
    status: 1,
    count,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [existingCreatedAt, setExistingCreatedAt] = useState<any>(null);

  const docId = `${userId}-${type}-${itemId}`;
  const listingRef = doc(db, "listings", docId);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchListing = async () => {
      const docSnap = await getDoc(listingRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setForm({
          status: data.status ?? 1,
          count: data.count ?? count,
        });
        setExistingCreatedAt(data.createdAt ?? null);
      } else {
        setForm({
          status: 1,
          count,
        });
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
        title,
        imageUrl,
        totalCount,
        createdAt: existingCreatedAt ?? serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...form,
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

      <Atom.Visibility state={isOpen}>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            <h2 className="font-bold text-lg mb-4">Add to Listing</h2>


            <div className="mb-2 flex gap-3 items-center">
              <img src={imageUrl} />
              <div>{title}</div>
            </div>

            <div className="mb-2">
              <strong>Count:</strong>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={form.count}
                  onChange={(e) => handleChange("count", Number(e.target.value))}
                  className="border rounded px-2 py-1 w-full flex-1"
                />
                <div>of</div>
                <div>{totalCount}</div>
              </div>
            </div>

            <div className="mb-4">
              <strong>Status:</strong>
              <select
                value={form.status}
                onChange={(e) =>
                  handleChange("status", Number(e.target.value))
                }
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

            <Atom.Visibility state={success}>
              <div className="text-green-600 mt-2 text-center">
                Saved successfully!
              </div>
            </Atom.Visibility>
          </div>
        </div>
      </Atom.Visibility>
    </Atom.Visibility>
  );
};

export default ListingEditor;
