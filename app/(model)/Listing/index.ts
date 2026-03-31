import FirebaseAdmin from "@lib/FirebaseAdmin";
import Nails from "core-nails";
import { ListingSchema } from "@schema";

const Listing = Nails.InitializeModel({
  collection: "listings",
  schema: ListingSchema,
  FirebaseAdmin,
});

export default Listing;
