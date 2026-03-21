import COLLECTION from "../collection";
import FirebaseAdmin from "@lib/FirebaseAdmin";

interface Payload {
  uid: string;
  email: string;
  username: string;
  avatarUrl: string;
}

const update = async (id: string, payload: Payload) => {
  if (!id || typeof id !== "string") {
    console.error(`Invalid ID: ${id}`);
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
