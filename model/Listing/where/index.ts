import COLLECTION from "../collection";
import { collection, query, where as firestoreWhere, getDocs } from "firebase/firestore";
import { db } from "@lib/Firebase";

type ListingType = "anime" | "manga" | "game" | "movie";

interface Listing {
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

const where = async (filters: Partial<Listing>): Promise<Listing[]> => {
  const colRef = collection(db, COLLECTION);

  const constraints = Object.entries(filters).map(([field, value]) =>
    firestoreWhere(field, "==", value)
  );

  const q = query(colRef, ...constraints);

  try {
    const querySnap = await getDocs(q);
    return querySnap.docs.map(doc => doc.data() as Listing);
  } catch (err) {
    console.error(`Error querying ${COLLECTION}:`, err);
    return [];
  }
};

export default where;
