import verifyFirebaseToken from "@service/firebase/verifyFirebaseToken";

export default async function destroy_action(req: Request, id: string) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return new Response("Unauthorized", { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  const verifiedToken = await verifyFirebaseToken(token);

  return new Response(JSON.stringify({ message: "destroy Listing" }));
}
