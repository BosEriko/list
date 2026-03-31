import FirebaseAdmin from "@lib/FirebaseAdmin";
import Nails from "core-nails";
import { UserActivitySchema } from "@schema";

const UserActivity = Nails.InitializeModel({
  collection: "userActivities",
  schema: UserActivitySchema,
  FirebaseAdmin,
});

export default UserActivity;
