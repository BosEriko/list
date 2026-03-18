// import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
// import { db } from "@lib/Firebase";
//
// const COLLECTION = "listings";
//
// interface IPayload {
//   userId: string;
//   itemId: string;
//   type: string;
//   title: string;
//   count: number;
//   status: number;
//   totalCount: number | null;
//   imageUrl: string;
// }
//
// const create = async (payload: IPayload) => {
//   const docId = `${payload.userId}-${payload.type}-${payload.itemId}`;
//   const docRef = doc(db, COLLECTION, docId);
//
//   try {
//     const docSnap = await getDoc(docRef);
//
//     if (docSnap.exists()) {
//       throw new Error(`Document with ID ${docId} already exists!`);
//     }
//
//     await setDoc(docRef, {
//       userId: payload.userId,
//       itemId: payload.itemId,
//       type: payload.type,
//       title: payload.title,
//       imageUrl: payload.imageUrl,
//       listingUrl: typeof window !== "undefined" ? window.location.pathname : "",
//       status: payload.status,
//       count: payload.count,
//       totalCount: payload.totalCount,
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//     });
//   } catch (err) {
//     console.error(`Error creating ${COLLECTION}:`, err);
//   }
// }
//
// export default create;
