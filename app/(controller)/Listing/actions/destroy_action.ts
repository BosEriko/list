import FirebaseController from "@controller/Firebase";
import Listing from "@model/Listing";

export default async function destroy_action(req: Request, id: string) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return new Response("Unauthorized", { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  const user = await FirebaseController.verify_firebase_token(token);

  const listing = await Listing.find(id);

  if (!listing) {
    return new Response("Not Found", { status: 404 });
  }

  if (listing.userId !== user.uid) {
    return new Response("Forbidden", { status: 403 });
  }

  await Listing.destroy(id);

  return new Response(JSON.stringify({ message: "Listing has been destroyed." }));
}
