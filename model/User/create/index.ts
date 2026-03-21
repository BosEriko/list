import COLLECTION from "../collection";
import FirebaseAdmin from "@lib/FirebaseAdmin";

interface Payload {
  uid: string;
  email: string;
  username: string;
  avatarUrl: string;
}

const create = async (id: string, payload: Payload) => {
  if (!id || typeof id !== "string") {
    console.error(`Invalid ID: ${id}`);
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
