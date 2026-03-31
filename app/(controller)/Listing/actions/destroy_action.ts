import verifyFirebaseToken from "@service/firebase/verifyFirebaseToken";
import Listing from "@model/Listing";

export default async function destroy_action(req: Request, id: string) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return new Response("Unauthorized", { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  const verifiedToken = await verifyFirebaseToken(token);

  const listing = await Listing.find(id);

  if (listing.userId !== verifiedToken.uid) {
    return new Response("Forbidden", { status: 403 });
  }

  await Listing.destroy(id);

  return new Response(JSON.stringify({ message: "Listing has been destroyed." }));
}
