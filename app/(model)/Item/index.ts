import CreateService from "../concerns/CreateService";
import { ItemSchema } from "@schema";

const Item = CreateService({
  collection: "items",
  schema: ItemSchema,
});

export default Item;
