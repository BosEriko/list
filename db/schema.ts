import FirebaseAdmin from "@lib/FirebaseAdmin";
import { z } from "zod";

// Helper Functions
const FirebaseTimestamp = z.union([
  z.instanceof(FirebaseAdmin.firestore.Timestamp),
  z.date(),
  z.custom((val) => val === FirebaseAdmin.firestore.FieldValue.serverTimestamp(), { message: "Expected serverTimestamp()" }),
]);

// Schema
export const UserActivitySchema = z.object({
  createdAt: FirebaseTimestamp.optional(),
  lastListingUpdate: FirebaseTimestamp.optional(),
  updatedAt: FirebaseTimestamp.optional(),
});
export type UserActivityType = z.infer<typeof UserActivitySchema>;

export const UserSchema = z.object({
  avatarUrl: z.string(),
  createdAt: FirebaseTimestamp.optional(),
  email: z.string(),
  uid: z.string(),
  updatedAt: FirebaseTimestamp.optional(),
  username: z.string(),
});
export type UserType = z.infer<typeof UserSchema>;
