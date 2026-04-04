import DiscordController from "@controller/Discord";
import FirebaseController from "@controller/Firebase";
import Listing from "@model/Listing";

export default async function update_action(req: Request, id: string) {
  const authHeader = req.headers.get("authorization");
  const payload = await req.json();

  if (!authHeader) {
    return new Response("Unauthorized", { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  const user = await FirebaseController.verify_firebase_token(token);

  if (id.split("-")[0] !== user.uid && payload.userId !== user.uid) {
    return new Response("Forbidden", { status: 403 });
  }

  await Listing.update(payload, id);
  await DiscordController.post_listing_update_to_discord(payload, user);

  return new Response(JSON.stringify({ message: "Listing has been updated." }));
}
