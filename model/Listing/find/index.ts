import { doc, getDoc } from "firebase/firestore";
import { db } from "@lib/Firebase";

const COLLECTION = "listings";

interface IListing {
  userId: string;
  itemId: string;
  type: string;
  title: string;
  count: number;
  status: number;
  totalCount: number | null;
  imageUrl: string;
  listingUrl: string;
  createdAt: any;
  updatedAt: any;
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
