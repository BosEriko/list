import Listing from "@model/Listing";
import AnimeController from "@controller/Anime";

export default async function all_listings(req: Request, id: string) {
  const listings = await Listing.where({ userId: id });

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
    }));
  } else {
    formattedListings = formattedListings.map((listing) => ({ ...listing, isOngoing: false }));
  }

  return new Response(JSON.stringify({ listings: formattedListings }));
}
