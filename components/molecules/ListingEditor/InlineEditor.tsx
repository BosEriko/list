"use client";
import { useState, Fragment, useRef, useEffect } from "react";
import useAuthStore from "@store/useAuthStore";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@lib/Firebase";

interface IInlineEditorProps {
  itemId: string;
  type: string;
  title: string;
  count: number;
  totalCount: number | null;
  imageUrl: string;
  status?: number;
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
}) => {
  const { user } = useAuthStore();
  const userId = user?.uid;

  const [form, setForm] = useState({ status, count });
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  const docId = `${userId}-${type}-${itemId}`;
  const listingRef = doc(db, "listings", docId);

  const computeNext = (newCount: number, newStatus?: number) => {
    let finalCount = newCount;
    let finalStatus = newStatus ?? form.status;

    if (finalCount < 0) {
      finalCount = 0;
      finalStatus = 1;
    }

    if (totalCount != null && finalCount >= totalCount) {
      finalCount = totalCount;
      finalStatus = 3;
    }

    return { count: finalCount, status: finalStatus };
  };

  const saveListing = async (newForm: typeof form) => {
    if (!userId) return;

    const payload = {
      userId,
      itemId,
      type,
      title,
      imageUrl,
      totalCount,
      updatedAt: serverTimestamp(),
      ...newForm,
    };

    try {
      await setDoc(listingRef, payload);
    } catch (err) {
      console.error("Error updating listing:", err);
    }
  };

  const scheduleSave = (newForm: typeof form) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      saveListing(newForm);
    }, 3000);
  };

  const handleDecreaseCount = () => {
    const newForm = computeNext(form.count - 1);
    setForm(newForm);
    scheduleSave(newForm);
  };

  const handleIncreaseCount = () => {
    const newForm = computeNext(form.count + 1);
    setForm(newForm);
    scheduleSave(newForm);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = Number(e.target.value);
    const newForm = computeNext(form.count, selectedStatus);
    setForm(newForm);
    scheduleSave(newForm);
  };

  useEffect(() => {
    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
        saveListing(form);
      }
    };
  }, [form]);

  return (
    <Fragment>
      <td className="w-15">
        <img
          src={imageUrl}
          alt={title}
          className="w-12 aspect-square object-cover rounded-lg"
        />
      </td>

      <td>{title}</td>

      <td className="text-center">
        <button
          onClick={handleDecreaseCount}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          -
        </button>

        <span className="mx-2">
          {form.count}
          {totalCount != null ? ` / ${totalCount}` : ""}
        </span>

        <button
          onClick={handleIncreaseCount}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          +
        </button>
      </td>

      <td className="text-center">
        <select
          value={form.status}
          onChange={handleStatusChange}
          className="border rounded px-2 py-1"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </td>
    </Fragment>
  );
};

export default InlineEditor;
