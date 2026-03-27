import CreateService from "../concerns/CreateService";
import collection from "./collection";
import schema from "./schema";

const UserActivity = CreateService({ collection, schema });

export default UserActivity;
