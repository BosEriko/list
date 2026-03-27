import CreateService from "../concerns/CreateService";
import { UserSchema } from "@schema";

const User = CreateService({
  collection: "users",
  schema: UserSchema,
});

export default User;
