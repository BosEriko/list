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
  createdAt: z.preprocess(firestoreTimestampToDate, z.date()).optional(),
  lastListingUpdate: z.preprocess(firestoreTimestampToDate, z.date()).optional(),
  updatedAt: z.preprocess(firestoreTimestampToDate, z.date()),
});

export const UserSchema = z.object({
  avatarUrl: z.string().optional(),
  createdAt: z.preprocess(firestoreTimestampToDate, z.date()).optional(),
  email: z.string().optional(),
  uid: z.string().optional().optional(),
  updatedAt: z.preprocess(firestoreTimestampToDate, z.date()),
  username: z.string().optional(),
});
