import COLLECTION from "../collection";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@lib/Firebase";

export type ListingType = "anime" | "manga" | "game" | "movie";

interface IListing {
  count: number;
  createdAt: any;
  imageUrl: string;
  itemId: string;
  listingUrl: string;
  status: number;
  title: string;
  totalCount: number | null;
  type: ListingType;
  updatedAt: any;
  userId: string;
}

const ID_PATTERN = /^[0-9]+-(anime|manga|game|movie)-[0-9]+$/;

const find = async (id: string): Promise<IListing | null> => {
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
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as IListing) : null;
  } catch (err) {
    console.error(`Error reading ${COLLECTION}:`, err);
    return null;
  }
}

export default find;
