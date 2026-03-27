import COLLECTION from "../collection";
import LISTING_ID_PATTERN from "@constant/LISTING_ID_PATTERN";
import MediaType from "@type/MediaType";
import DiscordController from "@controller/Discord";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@lib/Firebase";

interface Payload {
  count: number;
  imageUrl: string;
  itemId: string;
  listingUrl: string;
  status: number;
  title: string;
  totalCount: number | null;
  type: MediaType;
  userId: string;
}

const update = async (id: string, payload: Payload) => {
  if (!id || typeof id !== "string") {
    console.error(`Invalid ID: ${id}`);
    return null;
  }

  if (!LISTING_ID_PATTERN.test(id)) {
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
      ...payload,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    await DiscordController.update_status(payload);
  } catch (err) {
    console.error(`Error updating ${COLLECTION}:`, err);
  }
};

export default update;
