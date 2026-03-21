import COLLECTION from "../collection";
import FirebaseAdmin from "@lib/FirebaseAdmin";

type ItemType = "anime" | "manga" | "game" | "movie";
const ID_PATTERN = /^(anime|manga|game|movie)-[0-9]+$/;

interface IItem {
  itemId: string;
  type: ItemType;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
    };
  };
  title: string;
  totalCount: number | null;
  status: string;
  synopsis: string;
  score: number;
  createdAt: any;
  updatedAt: any;
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
