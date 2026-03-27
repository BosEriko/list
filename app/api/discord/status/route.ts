import DiscordController from "@controller/Discord";

export async function POST(req: Request) {
  const { payload, user } = await req.json();
  if (!payload) {
    return new Response(JSON.stringify({ error: "Missing payload" }), { status: 400 });
  }
  const result = await DiscordController.post_listing_update_to_discord(payload, user);
  return new Response(JSON.stringify(result), { status: 200 });
}
