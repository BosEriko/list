import COLLECTION from "../collection";
import MediaType from "@type/MediaType";
import { collection, query, where as firestoreWhere, getDocs } from "firebase/firestore";
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
