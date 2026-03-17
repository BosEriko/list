import { doc, getDoc } from "firebase/firestore";
import { db } from "@lib/Firebase";

const COLLECTION = "listings";

interface IPayload {
  userId: string;
  itemId: string;
  type: string;
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
  listingUrl?: string;
  updatedAt?: any;
}

const read = async (payload: IPayload): Promise<IListing | {}> => {
  const docId = `${payload.userId}-${payload.type}-${payload.itemId}`;
  const docRef = doc(db, COLLECTION, docId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return {};
  }
}

export default read;
