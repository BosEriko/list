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

// Schema
export const UserActivitySchema = z.object({
  createdAt: z.preprocess(firestoreTimestampToDate, z.date()),
  lastListingUpdate: z.preprocess(firestoreTimestampToDate, z.date()),
  updatedAt: z.preprocess(firestoreTimestampToDate, z.date()),
});

export const UserSchema = z.object({
  avatarUrl: z.string(),
  createdAt: z.preprocess(firestoreTimestampToDate, z.date()),
  email: z.string(),
  uid: z.string(),
  updatedAt: z.preprocess(firestoreTimestampToDate, z.date()),
  username: z.string(),
});
