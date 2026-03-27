import CreateService from "../concerns/CreateService";
import UserActivitySchema from "./schema";

const UserActivity = CreateService({
  collection: "userActivities",
  schema: UserActivitySchema,
});

export default UserActivity;
