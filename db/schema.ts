import FirebaseAdmin from "@lib/FirebaseAdmin";
import Nails from "core-nails";
import { z } from "zod";
import MEDIA from "@constant/MEDIA";

// UserActivity Schema
export const UserActivitySchema = z.object({
  createdAt: Nails.FirebaseTimestampType(FirebaseAdmin).optional(),
  lastListingUpdate: Nails.FirebaseTimestampType(FirebaseAdmin).optional(),
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
  count: z.number().int(),
  createdAt: Nails.FirebaseTimestampType(FirebaseAdmin).optional(),
  imageUrl: z.string(),
  itemId: z.string(),
  listingUrl: z.string(),
  status: z.number().int(),
  title: z.string(),
  totalCount: z.number().int(),
  type: z.enum(MEDIA),
  updatedAt: Nails.FirebaseTimestampType(FirebaseAdmin).optional(),
  userId: z.string(),
});
export type ListingType = z.infer<typeof ListingSchema>;
