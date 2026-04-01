import Listing from "@model/Listing";

export default async function show_action(req: Request, id: string) {
  const listing = await Listing.find(id);

  if (!listing) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(JSON.stringify({ listing }));
}
