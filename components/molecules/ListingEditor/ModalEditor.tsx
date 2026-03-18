"use client";
import { useState, useEffect } from "react";
import useAuthStore from "@store/useAuthStore";
import Listing from "@model/Listing";
import Atom from "@atom";

interface IModalEditorProps {
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

const ModalEditor: React.FC<IModalEditorProps> = ({
  itemId,
  type,
  title,
  count,
  totalCount,
  imageUrl,
}) => {
  const { user } = useAuthStore();
  const userId = user?.uid;
  const [form, setForm] = useState({ status: 1, count });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!isOpen || !userId) return;
    const fetchListing = async () => {
      const listing = await Listing.find(`${userId}-${type}-${itemId}`);
      setForm({
        status: listing?.status ?? 1,
        count: listing?.count ?? count,
      });
    };
    fetchListing();
  }, [isOpen, userId]);

  useEffect(() => {
    if (totalCount && form.count >= totalCount) {
      setForm((prev) => ({
        ...prev,
        count: totalCount,
        status: 3,
      }));
    }
    if (form.count < 0) {
      setForm((prev) => ({
        ...prev,
        count: 0,
        status: 1,
      }));
    }
  }, [form.count, totalCount]);

  const handleSave = async () => {
    if (!userId) return;
    setLoading(true);
    const payload = {
      imageUrl,
      itemId,
      title,
      totalCount,
      type,
      userId,
      ...form,
    };
    try {
      await Listing.create(`${userId}-${type}-${itemId}`, payload);
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
        className="bg-green-500 text-white px-4 py-2 rounded-md w-full cursor-pointer"
      >
        + Add to List
      </button>

      <Atom.Visibility state={isOpen}>
        <div className="fixed inset-0 flex justify-center items-center z-50" style={{ backgroundColor: "rgba(0,0,0,.80)" }}>
          <div className="bg-white rounded-lg p-5 w-96 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 cursor-pointer"
            >
              ✕
            </button>

            <h2 className="font-bold text-lg mb-4">Add to Listing</h2>

            <div className="mb-2">
              <strong>Count:</strong>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={form.count}
                  onChange={(e) => handleChange("count", Number(e.target.value))}
                  className="border border-gray-400 rounded px-2 py-1 w-full flex-1"
                />
                <Atom.Visibility state={!!totalCount}>
                  <div>of</div>
                  <div>{totalCount}</div>
                </Atom.Visibility>
              </div>
            </div>

            <div className="mb-4">
              <strong>Status:</strong>
              <select
                value={form.status}
                onChange={(e) =>
                  handleChange("status", Number(e.target.value))
                }
                className="border border-gray-400 rounded px-2 py-1 w-full"
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

export default ModalEditor;
