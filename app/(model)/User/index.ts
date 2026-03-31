import FirebaseAdmin from "@lib/FirebaseAdmin";
import Nails from "core-nails";
import { UserSchema } from "@schema";

const User = Nails.InitializeModel({
  collection: "users",
  schema: UserSchema,
  FirebaseAdmin,
});

export default User;
