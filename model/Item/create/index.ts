import COLLECTION from "../collection";
import FirebaseAdmin from "@lib/FirebaseAdmin";

type ItemType = "anime" | "manga" | "game" | "movie";
const ID_PATTERN = /^(anime|manga|game|movie)-[0-9]+$/;

interface IPayload {
  itemId: string;
  type: ItemType;
  images: any;
  title: string;
  totalCount: number | null;
  status: string;
  synopsis: string;
  score: number;
}

const create = async (id: string, payload: IPayload) => {
  if (!id || typeof id !== "string") {
    console.error(`Invalid ID: ${id}`);
    return null;
  }

  if (!ID_PATTERN.test(id)) {
    console.error(`Malformed ID: ${id}`);
    return null;
  }

  const database = FirebaseAdmin.firestore();
  const reference = database.collection(COLLECTION).doc(id);
  try {
    const snapshot = await reference.get();
    if (snapshot.exists) {
      throw new Error(`Document with ID ${id} already exists`);
    }
    await reference.set({
      ...payload,
      createdAt: FirebaseAdmin.firestore.FieldValue.serverTimestamp(),
      updatedAt: FirebaseAdmin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error(`Error updating ${COLLECTION}:`, err);
  }
};

export default create;
