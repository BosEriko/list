import COLLECTION from "../collection";
import ITEM_ID_PATTERN from "@constant/ITEM_ID_PATTERN";
import FirebaseAdmin from "@lib/FirebaseAdmin";
import MediaType from "@type/MediaType";

interface Payload {
  itemId: string;
  type: MediaType;
  images: any;
  title: string;
  totalCount: number | null;
  status: string;
  synopsis: string;
  score: number;
}

const update = async (id: string, payload: Payload) => {
  if (!id || typeof id !== "string") {
    console.error(`Invalid ID: ${id}`);
    return null;
  }

  if (!ITEM_ID_PATTERN.test(id)) {
    console.error(`Malformed ID: ${id}`);
    return null;
  }

  const database = FirebaseAdmin.firestore();
  const reference = database.collection(COLLECTION).doc(id);
  try {
    await reference.set({
      ...payload,
      updatedAt: FirebaseAdmin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.error(`Error updating ${COLLECTION}:`, err);
  }
};

export default update;
