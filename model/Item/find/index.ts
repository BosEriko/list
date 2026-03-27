import COLLECTION from "../collection";
import ITEM_ID_PATTERN from "@constant/ITEM_ID_PATTERN";
import FirebaseAdmin from "@lib/FirebaseAdmin";
import MediaType from "@type/MediaType";

interface Item {
  itemId: string;
  type: MediaType;
  images: any;
  title: string;
  totalCount: number | null;
  status: string;
  synopsis: string;
  score: number;
  createdAt: any;
  updatedAt: any;
}

const find = async (id: string): Promise<Item | null> => {
  if (!id || typeof id !== "string") {
    console.warn(`Invalid ID: ${id}`);
    return null;
  }

  if (!ITEM_ID_PATTERN.test(id)) {
    console.warn(`Malformed ID: ${id}`);
    return null;
  }

  const database = FirebaseAdmin.firestore();
  const reference = database.collection(COLLECTION).doc(id);
  try {
    const snapshot = await reference.get();
    return snapshot.exists ? (snapshot.data() as Item) : null;
  } catch (err) {
    console.error(`Error reading ${COLLECTION}:`, err);
    return null;
  }
}

export default find;
