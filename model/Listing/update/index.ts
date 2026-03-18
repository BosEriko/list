import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@lib/Firebase";

const COLLECTION = "listings";

interface IPayload {
  userId: string;
  itemId: string;
  type: string;
  title: string;
  count: number;
  status: number;
  totalCount: number | null;
  imageUrl: string;
}

const update = async (payload: IPayload) => {
  const docId = `${payload.userId}-${payload.type}-${payload.itemId}`;
  const docRef = doc(db, COLLECTION, docId);
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
}

export default update;
