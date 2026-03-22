const websiteUrl = "https://list.boseriko.com";

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function buildDescription(payload: {
  status: number;
  type: "anime" | "manga" | "game" | "movie";
  count: number;
}) {
  const { status, type, count } = payload;

  const actionVerbs: Record<typeof type, string> = {
    anime: "episode",
    manga: "chapter",
    game: "progress",
    movie: "watch",
  };

  switch (status) {
    case 3:
      return "✅ Finished";
    case 0:
      return "❌ Dropped";
    case 5:
      return "⏸️ Paused";
    case 2:
      if (type === "game") return "⭐ Added to wishlist";
      return `⭐ Planning to ${type === "manga" ? "read" : "watch"}`;
    case 1:
    case 4:
      if (type === "movie") return "🎬 Watching";
      const action = actionVerbs[type];
      const verb = type === "manga" ? "Reading" : type === "game" ? "Playing" : "Watching";
      return `▶️ ${capitalize(verb)} (${action} ${count})`;
    default:
      return "📺 Updated";
  }
}

export async function POST(req: Request) {
  const { payload, method, username, avatar_url } = await req.json();

  if (!payload) {
    return new Response(
      JSON.stringify({ error: "Missing payload" }),
      { status: 400 }
    );
  }

  const { title, count, status, type, listingUrl, imageUrl } = payload;

  const embed = {
    title: title,
    url: `${websiteUrl}${listingUrl}`,
    description: buildDescription(payload),
    thumbnail: imageUrl ? { url: imageUrl } : undefined,
  };

  await fetch(process.env.DISCORD_STATUS_WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      avatar_url,
      embeds: [embed],
    }),
  });

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
