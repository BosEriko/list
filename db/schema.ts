import { z } from "zod";

// Schema
export const UserActivitySchema = z.object({
  createdAt: z.instanceof(Date).optional(),
  lastListingUpdate: z.instanceof(Date).optional(),
  updatedAt: z.instanceof(Date).optional(),
});

export const UserSchema = z.object({
  avatarUrl: z.string(),
  createdAt: z.instanceof(Date).optional(),
  email: z.string(),
  uid: z.string(),
  updatedAt: z.instanceof(Date).optional(),
  username: z.string(),
});
