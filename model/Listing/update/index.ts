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
  type: ListingType;
  userId: string;
}

const update = async (id: string, payload: IPayload) => {
  if (!id || typeof id !== "string") {
    console.error(`Invalid ID: ${id}`);
    return null;
  }

  if (!ID_PATTERN.test(id)) {
    console.error(`Malformed ID: ${id}`);
    return null;
  }

  if (payload.totalCount && payload.count >= payload.totalCount && payload.status !== 3) {
    console.error("Status must be set to 3 when count is greater than or equal to totalCount.");
    return null;
  }

  const docRef = doc(db, COLLECTION, id);
  try {
    await setDoc(docRef, {
      count: payload.count,
      imageUrl: payload.imageUrl,
      itemId: payload.itemId,
      status: payload.status,
      title: payload.title,
      totalCount: payload.totalCount,
      type: payload.type,
      updatedAt: serverTimestamp(),
      userId: payload.userId,
    }, { merge: true });
  } catch (err) {
    console.error(`Error updating ${COLLECTION}:`, err);
  }
};

export default update;
