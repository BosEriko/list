import verifyFirebaseToken from "@service/firebase/verifyFirebaseToken";
import DiscordController from "@controller/Discord";
import Listing from "@model/Listing";

export default async function create_action(req: Request) {
  const authHeader = req.headers.get("authorization");
  const payload = await req.json();
  const id = `${payload.userId}-${payload.type}-${payload.itemId}`;

  if (!authHeader) {
    return new Response("Unauthorized", { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  const user = await verifyFirebaseToken(token);

  if (id.split("-")[0] !== user.uid && payload.userId !== user.uid) {
    return new Response("Forbidden", { status: 403 });
  }

  await Listing.create(payload, id);
  await DiscordController.post_listing_update_to_discord(payload, user);

  return new Response(JSON.stringify({ message: "Listing has been created." }));
}
