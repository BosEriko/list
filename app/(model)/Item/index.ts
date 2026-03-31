import FirebaseAdmin from "@lib/FirebaseAdmin";
import Nails from "core-nails";
import { ItemSchema } from "@schema";

const Item = Nails.InitializeModel({
  collection: "items",
  schema: ItemSchema,
  FirebaseAdmin,
});

export default Item;
