import FirebaseAdmin from "@lib/FirebaseAdmin";
import { getListingFromAPI } from "./getListingFromAPI";

const ONE_MONTH = 1000 * 60 * 60 * 24 * 30;

export async function getListingFromFirebase(id: string, type: string) {
  if (!["anime", "manga"].includes(type)) {
    throw new Error("Invalid type");
  }

  const db = FirebaseAdmin.firestore();

  const docId = `${type}-${id}`;
  const ref = db.collection("items").doc(docId);
  const snapshot = await ref.get();

  if (snapshot.exists) {
    const data = snapshot.data();

    const updatedAt = data?.updatedAt?.toMillis?.() ?? 0;

    if (Date.now() - updatedAt < ONE_MONTH) {
      return data;
    }
  }

  const jikan = await getListingFromAPI(type, id);

  const existingData = snapshot.exists ? snapshot.data() : null;

  const dataToSave = {
    itemId: id,
    type,
    images: jikan.images,
    title: jikan.title,
    totalCount: jikan.episodes ?? jikan.chapters,
    status: jikan.status,
    synopsis: jikan.synopsis,
    score: jikan.score,
    createdAt:
      existingData?.createdAt ??
      FirebaseAdmin.firestore.FieldValue.serverTimestamp(),
    updatedAt: FirebaseAdmin.firestore.FieldValue.serverTimestamp(),
  };

  await ref.set(dataToSave, { merge: true });

  return {
    ...dataToSave,
    updatedAt: new Date(),
  };
}
