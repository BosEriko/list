"use client";
import { useState, Fragment, useRef, useEffect } from "react";
import useAuthStore from "@store/useAuthStore";
import ListingStatusOptions from '@constant/ListingStatusOptions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Listing from "@model/Listing";
import Atom from "@atom";

type ListingType = "anime" | "manga" | "game" | "movie";

interface InlineEditorProps {
  count: number;
  imageUrl: string;
  itemId: string;
  listingUrl: string;
  status: number;
  title: string;
  totalCount: number | null;
  type: ListingType;
  userId: string;
  isOngoing: boolean;
}

const InlineEditor: React.FC<InlineEditorProps> = ({
  itemId,
  type,
  title,
  count,
  totalCount,
  userId,
  listingUrl,
  imageUrl,
  status,
  isOngoing,
}) => {
  const { user } = useAuthStore();
  const [form, setForm] = useState({ status, count });
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);

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
    if (user?.uid !== userId) return;

    const payload = {
      imageUrl,
      itemId,
      listingUrl,
      title,
      totalCount,
      type,
      userId: user?.uid,
      ...newForm,
    };

    try {
      await Listing.update(`${user?.uid}-${type}-${itemId}`, payload);
    } catch (err) {
      console.error("Error updating listing:", err);
    }
  };

  const scheduleSave = (newForm: typeof form) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      saveListing(newForm);
    }, 1000);
  };

  const handleManualCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (rawVal === "") {
      setForm({ ...form, count: 0 });
      return;
    }
    if (/^\d+$/.test(rawVal)) {
      const num = Number(rawVal);
      const finalNum = totalCount && num > totalCount ? totalCount : num;
      const newForm = computeNext(finalNum);
      setForm(newForm);
      scheduleSave(newForm);
    } else {
      const newForm = computeNext(form.count);
      setForm(newForm);
      scheduleSave(newForm);
    }
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
  }, []);


  const deleteListing = async () => {
    if (user?.uid !== userId) return;
    try {
      await Listing.destroy(`${user?.uid}-${type}-${itemId}`);
      setIsDeleted(true);
    } catch (err) {
      console.error("Error deleting listing:", err);
    }
  }

  if (isDeleted) return null;

  return (
    <Fragment>
      <tr>
        <td className="w-15">
          <div className="w-12 aspect-square relative">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover rounded-md"
            />
            <Atom.Visibility state={isOngoing}>
              <div className="absolute bottom-0 right-0 w-3 aspect-square rounded-full bg-green-500 -mr-1 -mb-1 border border-white border-2"></div>
            </Atom.Visibility>
          </div>
        </td>

        <td><a href={listingUrl}>{title}</a></td>

        <td className="whitespace-nowrap">
          <div className="mr-5">
            <Atom.Visibility state={user?.uid === userId}>
              <button
                onClick={handleDecreaseCount}
                className="px-2 py-1 bg-gray-200 rounded cursor-pointer hover:bg-gray-100 transition-all"
              >
                -
              </button>
            </Atom.Visibility>

            <span className="mx-2">
              <Atom.Visibility state={user?.uid !== userId}>
                {form.count}
              </Atom.Visibility>
              <Atom.Visibility state={user?.uid === userId}>
                <input
                  className="mx-2 w-16 text-center border border-gray-400 rounded px-1 py-0.5"
                  value={form.count}
                  min={0}
                  max={totalCount ?? undefined}
                  onChange={handleManualCount}
                />
              </Atom.Visibility>
              {totalCount != null ? ` / ${totalCount}` : ""}
            </span>

            <Atom.Visibility state={user?.uid === userId}>
              <button
                onClick={handleIncreaseCount}
                className="px-2 py-1 bg-gray-200 rounded cursor-pointer hover:bg-gray-100 transition-all"
              >
                +
              </button>
            </Atom.Visibility>
          </div>
        </td>

        <td className="whitespace-nowrap">
          <Atom.Visibility state={user?.uid !== userId}>
            {ListingStatusOptions[type].find(option => option.value === form.status)?.label}
          </Atom.Visibility>
          <Atom.Visibility state={user?.uid === userId}>
            <select
              value={form.status}
              onChange={handleStatusChange}
              className="border border-gray-400 rounded px-2 py-1"
            >
              {ListingStatusOptions[type].map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Atom.Visibility>
        </td>
        <td>
          <Atom.Visibility state={user?.uid === userId}>
            <button onClick={deleteListing} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition ml-3 cursor-pointer">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </Atom.Visibility>
        </td>
      </tr>
    </Fragment>
  );
};

export default InlineEditor;
