import FirebaseAdmin from "@lib/FirebaseAdmin";
import { z } from "zod";

// Helper Functions
const FirebaseTimestamp = z.union([
  z.instanceof(FirebaseAdmin.firestore.Timestamp),
  z.date(),
  z.custom((val) => val === FirebaseAdmin.firestore.FieldValue.serverTimestamp(), { message: "Expected serverTimestamp()" }),
]);

// UserActivity Schema
export const UserActivitySchema = z.object({
  createdAt: FirebaseTimestamp.optional(),
  lastListingUpdate: FirebaseTimestamp.optional(),
  updatedAt: FirebaseTimestamp.optional(),
});
export type UserActivityType = z.infer<typeof UserActivitySchema>;

// User Schema
export const UserSchema = z.object({
  avatarUrl: z.string(),
  createdAt: FirebaseTimestamp.optional(),
  email: z.string(),
  uid: z.string(),
  updatedAt: FirebaseTimestamp.optional(),
  username: z.string(),
});
export type UserType = z.infer<typeof UserSchema>;

// Item Schema
export const ItemSchema = z.object({
  createdAt: FirebaseTimestamp.optional(),
  images: z.object({
    jpg: z.object({
      image_url: z.string().url(),
      large_image_url: z.string().url(),
      small_image_url: z.string().url(),
    }),
    webp: z.object({
      image_url: z.string().url(),
      large_image_url: z.string().url(),
      small_image_url: z.string().url(),
    }),
  }),
  itemId: z.string(),
  score: z.number(),
  status: z.string(),
  synopsis: z.string(),
  title: z.string(),
  totalCount: z.number().int(),
  type: z.string(),
  updatedAt: FirebaseTimestamp.optional(),
});
export type ItemType = z.infer<typeof ItemSchema>;

// Listing Schema
export const ListingSchema = z.object({
  createdAt: FirebaseTimestamp.optional(),
  updatedAt: FirebaseTimestamp.optional(),
});
export type ListingType = z.infer<typeof ListingSchema>;
