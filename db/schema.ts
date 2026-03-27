import { z } from "zod";

// Helper Functions
function firestoreTimestampToDate(val: unknown) {
  if (
    val &&
    typeof val === "object" &&
    "toDate" in val &&
    typeof (val as any).toDate === "function"
  ) {
    return (val as FirebaseFirestore.Timestamp).toDate();
  }

  return val;
}

// Sceham
export const UserActivitySchema = z.object({
  lastListingUpdate: z.preprocess(firestoreTimestampToDate, z.date()),
});
