import COLLECTION from "../collection";
import LISTING_ID_PATTERN from "@constant/LISTING_ID_PATTERN";
import MediaType from "@type/MediaType";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@lib/Firebase";

interface Listing {
  count: number;
  createdAt: any;
  imageUrl: string;
  itemId: string;
  listingUrl: string;
  status: number;
  title: string;
  totalCount: number | null;
  type: MediaType;
  updatedAt: any;
  userId: string;
}

const find = async (id: string): Promise<Listing | null> => {
  if (!id || typeof id !== "string") {
    console.warn(`Invalid ID: ${id}`);
    return null;
  }

  if (!LISTING_ID_PATTERN.test(id)) {
    console.warn(`Malformed ID: ${id}`);
    return null;
  }

  const docRef = doc(db, COLLECTION, id);
  try {
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as Listing) : null;
  } catch (err) {
    console.error(`Error reading ${COLLECTION}:`, err);
    return null;
  }
}

export default find;
