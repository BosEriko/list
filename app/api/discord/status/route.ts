export async function POST(req: Request) {
  const body = await req.json();
  const { message } = body;
  const webhookUrl = process.env.DISCORD_STATUS_WEBHOOK_URL;

  if (!webhookUrl) {
    return new Response("Missing webhook", { status: 500 });
  }

  await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: message,
    }),
  });

  return Response.json({ ok: true });
}
