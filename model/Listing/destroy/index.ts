// import { doc, deleteDoc } from "firebase/firestore";
// import { db } from "@lib/Firebase";
//
// const COLLECTION = "listings";
//
// interface IPayload {
//   userId: string;
//   itemId: string;
//   type: string;
// }
//
// const destroy = async (payload: IPayload) => {
//   const docId = `${payload.userId}-${payload.type}-${payload.itemId}`;
//   const docRef = doc(db, COLLECTION, docId);
//
//   try {
//     await deleteDoc(docRef);
//     console.log(`Document ${docId} deleted successfully!`);
//   } catch (err) {
//     console.error(`Error deleting ${COLLECTION}:`, err);
//   }
// }
//
// export default destroy;
