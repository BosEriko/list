import Listing from "@model/Listing";
import AnimeController from "@controller/Anime";
import { ListingType } from "@schema";

type ListingTypeWithOngoing = Omit<ListingType, "id"> & { isOngoing: string };

export default async function all_listings(req: Request, id: string) {
  // TODO: Update query to rails like parameters
  const listings = await Listing.where([
    { field: "userId", operator: "==", value: id },
  ]);

  if (!listings) {
    return new Response(JSON.stringify({ listings: [] }));
  }

  let formattedListings = listings;

  if (listings.some((l) => l.type === "anime")) {
    const ongoingAnimeIds = await AnimeController.get_ongoing_anime_ids();
    const ongoingSet = new Set<number>(ongoingAnimeIds);
    formattedListings = formattedListings.map((listing) => ({
      ...listing,
      isOngoing: listing.type === "anime" ? ongoingSet.has(Number(listing.itemId)) : false,
    })) as ListingTypeWithOngoing[];
  } else {
    formattedListings = formattedListings.map((listing) => ({ ...listing, isOngoing: false })) as ListingTypeWithOngoing[];
  }

  return new Response(JSON.stringify({ listings: formattedListings }));
}
