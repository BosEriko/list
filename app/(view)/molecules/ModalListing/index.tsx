"use client";
import Api from "@lib/Api";
import { useState, useEffect } from "react";
import LISTING_STATUS_OPTIONS from '@constant/LISTING_STATUS_OPTIONS';
import useAuthStore from "@store/useAuthStore";
import Listing from "@old-model/Listing";
import Atom from "@atom";
import MediaType from "@type/MediaType";

interface ModalListingProps {
  count: number;
  imageUrl: string;
  itemId: string;
  title: string;
  totalCount: number | null;
  type: MediaType;
}

const ModalListing: React.FC<ModalListingProps> = ({
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
  const [isUpdate, setIsUpdate] = useState(false);

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
      setIsUpdate(!!listing);
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
      listingUrl: typeof window !== "undefined" ? window.location.pathname : "",
      title,
      totalCount,
      type,
      userId,
      ...form,
    };
    try {
      if (isUpdate) {
        await Api("PUT", `/api/listings/${user?.uid}-${type}-${itemId}`, { body: payload });
      } else {
        await Api("POST", `/api/listings`, { body: payload });
      }
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
                {LISTING_STATUS_OPTIONS[type].map((opt) => (
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

export default ModalListing;
