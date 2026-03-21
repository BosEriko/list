import COLLECTION from "../collection";
import FirebaseAdmin from "@lib/FirebaseAdmin";

type ItemType = "anime" | "manga" | "game" | "movie";
const ID_PATTERN = /^(anime|manga|game|movie)-[0-9]+$/;

// TODO: Check if types are correct
interface IItem {
  count: number;
  createdAt: any;
  imageUrl: string;
  itemId: string;
  listingUrl: string;
  status: number;
  title: string;
  totalCount: number | null;
  type: ItemType;
  updatedAt: any;
  userId: string;
}

const find = async (id: string): Promise<IItem | null> => {
  if (!id || typeof id !== "string") {
    console.warn(`Invalid ID: ${id}`);
    return null;
  }

  if (!ID_PATTERN.test(id)) {
    console.warn(`Malformed ID: ${id}`);
    return null;
  }

  const database = FirebaseAdmin.firestore();
  const reference = database.collection(COLLECTION).doc(id);
  try {
    const snapshot = await reference.get();
    return snapshot.exists ? (snapshot.data() as IItem) : null;
  } catch (err) {
    console.error(`Error reading ${COLLECTION}:`, err);
    return null;
  }
}

export default find;
