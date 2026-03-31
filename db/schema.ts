import FirebaseAdmin from "@lib/FirebaseAdmin";
import Nails from "core-nails";
import { z } from "zod";

// UserActivity Schema
export const UserActivitySchema = z.object({
  createdAt: Nails.FirebaseTimestampType(FirebaseAdmin).optional(),
  lastListingUpdate: FirebaseTimestamp.optional(),
  updatedAt: Nails.FirebaseTimestampType(FirebaseAdmin).optional(),
});
export type UserActivityType = z.infer<typeof UserActivitySchema>;

// User Schema
export const UserSchema = z.object({
  avatarUrl: z.string(),
  createdAt: Nails.FirebaseTimestampType(FirebaseAdmin).optional(),
  email: z.string(),
  uid: z.string(),
  updatedAt: Nails.FirebaseTimestampType(FirebaseAdmin).optional(),
  username: z.string(),
});
export type UserType = z.infer<typeof UserSchema>;

// Item Schema
export const ItemSchema = z.object({
  createdAt: Nails.FirebaseTimestampType(FirebaseAdmin).optional(),
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
  updatedAt: Nails.FirebaseTimestampType(FirebaseAdmin).optional(),
});
export type ItemType = z.infer<typeof ItemSchema>;

// Listing Schema
export const ListingSchema = z.object({
  createdAt: Nails.FirebaseTimestampType(FirebaseAdmin).optional(),
  updatedAt: Nails.FirebaseTimestampType(FirebaseAdmin).optional(),
});
export type ListingType = z.infer<typeof ListingSchema>;
