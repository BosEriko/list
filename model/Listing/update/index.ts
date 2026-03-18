import COLLECTION from "../collection";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@lib/Firebase";

type ListingType = "anime" | "manga" | "game" | "movie";
const ID_PATTERN = /^[0-9]+-(anime|manga|game|movie)-[0-9]+$/;

interface IPayload {
  count: number;
  imageUrl: string;
  itemId: string;
  status: number;
  title: string;
  totalCount: number | null;
  type: string;
  userId: string;
}

const update = async (id: string, payload: IPayload) => {
  if (!id || typeof id !== "string") {
    console.warn(`Invalid ID: ${id}`);
    return null;
  }

  if (!ID_PATTERN.test(id)) {
    console.warn(`Malformed ID: ${id}`);
    return null;
  }

  const docRef = doc(db, COLLECTION, id);
  try {
    await setDoc(docRef, {
      userId: payload.userId,
      itemId: payload.itemId,
      type: payload.type,
      title: payload.title,
      imageUrl: payload.imageUrl,
      listingUrl: typeof window !== "undefined" ? window.location.pathname : "",
      status: payload.status,
      count: payload.count,
      totalCount: payload.totalCount,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.error(`Error updating ${COLLECTION}:`, err);
  }
};

export default update;
