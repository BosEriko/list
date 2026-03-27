import CreateService from "../concerns/CreateService";
import { ListingSchema } from "@schema";

const Listing = CreateService({
  collection: "listings",
  schema: ListingSchema,
});

export default Listing;
