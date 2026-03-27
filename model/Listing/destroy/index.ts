import COLLECTION from "../collection";
import LISTING_ID_PATTERN from "@constant/LISTING_ID_PATTERN";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@lib/Firebase";

const destroy = async (id: string) => {
  if (!id || typeof id !== "string") {
    console.error(`Invalid ID: ${id}`);
    return null;
  }

  if (!LISTING_ID_PATTERN.test(id)) {
    console.error(`Malformed ID: ${id}`);
    return null;
  }

  const docRef = doc(db, COLLECTION, id);
  try {
    await deleteDoc(docRef);
  } catch (err) {
    console.error(`Error deleting ${COLLECTION}:`, err);
  }
}

export default destroy;
