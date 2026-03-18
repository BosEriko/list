import COLLECTION from "../collection";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@lib/Firebase";

const all = async () => {
  const querySnap = await getDocs(collection(db, COLLECTION));

  const listings = querySnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return listings;
};

export default all;
