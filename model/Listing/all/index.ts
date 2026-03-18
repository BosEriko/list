import COLLECTION from "../collection.ts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@lib/Firebase";

const readAll = async () => {
  const querySnapshot = await getDocs(collection(db, COLLECTION));

  const listings = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return listings;
};

export default readAll;
