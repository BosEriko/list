import COLLECTION from "../collection";
import UpdateDiscordStatus from "@lib/UpdateDiscordStatus";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@lib/Firebase";

type ListingType = "anime" | "manga" | "game";
const ID_PATTERN = /^[0-9]+-(anime|manga|game)-[0-9]+$/;

interface Payload {
  count: number;
  imageUrl: string;
  itemId: string;
  listingUrl: string;
  status: number;
  title: string;
  totalCount: number | null;
  type: ListingType;
  userId: string;
}

const create = async (id: string, payload: Payload) => {
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
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      throw new Error(`Document with ID ${id} already exists!`);
    }
    await setDoc(docRef, {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    await UpdateDiscordStatus(payload);
  } catch (err) {
    console.error(`Error creating ${COLLECTION}:`, err);
  }
}

export default create;
