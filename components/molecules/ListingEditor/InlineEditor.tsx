"use client";
import { useState, useEffect } from "react";
import useAuthStore from "@store/useAuthStore";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@lib/Firebase";
import Atom from "@atom";

interface IInlineEditorProps {
  itemId: string;
  type: string;
  title: string;
  count: number;
  totalCount: number | null;
  imageUrl: string;
  status?: number;
  key?: number | null
}

const statusOptions = [
  { value: 0, label: "Dropped" },
  { value: 1, label: "Watching" },
  { value: 2, label: "Plan to watch" },
  { value: 3, label: "Completed" },
  { value: 4, label: "Rewatching" },
  { value: 5, label: "Paused" },
];

const InlineEditor: React.FC<IInlineEditorProps> = ({
  itemId,
  type,
  title,
  count,
  totalCount,
  imageUrl,
  status = 1,
  key = null,
}) => {
  const { user } = useAuthStore();
  const userId = user?.uid;

  const [form, setForm] = useState({
    status,
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
    if (!userId) return;

    const fetchListing = async () => {
      const docSnap = await getDoc(listingRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setForm({
          status: data.status ?? status,
          count: data.count ?? count,
        });
        setExistingCreatedAt(data.createdAt ?? null);
      } else {
        setForm({
          status,
          count,
        });
        setExistingCreatedAt(null);
      }
    };

    fetchListing();
  }, [userId, listingRef]);

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

  const handleDecreaseCount = async () => {
    if (form.count >= 0) {
      setForm((prev) => ({
        ...prev,
        count: form.count - 1,
      }));
      handleSave();
    }
  }

  const handleIncreaseCount = async () => {
    if (totalCount && form.count <= totalCount) {
      setForm((prev) => ({
        ...prev,
        count: form.count + 1,
      }));
      handleSave();
    }
  }

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
      <tr key={key}>
        <td className="w-15">
          <img src={imageUrl} alt={title} className="w-12 aspect-square object-cover rounded-lg" />
        </td>

        <td>{title}</td>

        <td className="text-center">
          <button onClick={handleDecreaseCount}>-</button>{form.count}{totalCount ? ` / ${totalCount}` : ""}<button onClick={handleIncreaseCount}>+</button>
        </td>

        <td className="text-center">{statusOptions.find(option => option.value === form.status)?.label}</td>
      </tr>
    </Atom.Visibility>
  );
};

export default InlineEditor;
