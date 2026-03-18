import COLLECTION from "../collection";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@lib/Firebase";

const COLLECTION = "listings";

interface IListing {
  count: number;
  createdAt: any;
  imageUrl: string;
  itemId: string;
  listingUrl: string;
  status: number;
  title: string;
  totalCount: number | null;
  type: string;
  updatedAt: any;
  userId: string;
}

const find = async (id: String): Promise<IListing | null> => {
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
