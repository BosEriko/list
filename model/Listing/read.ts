import { doc, getDoc } from "firebase/firestore";
import { db } from "@lib/Firebase";

// TODO: If no itemId and type is passed, fetch all listings of the userId

const COLLECTION = "listings";

interface IPayload {
  userId: string;
  itemId?: string;
  type?: string;
}

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

const read = async (payload: IPayload): Promise<IListing | null> => {
  const docId = `${payload.userId}-${payload.type}-${payload.itemId}`;
  const docRef = doc(db, COLLECTION, docId);
  try {
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as IListing) : null;
  } catch (err) {
    console.error(`Error reading ${COLLECTION}:`, err);
    return null;
  }
}

export default read;
