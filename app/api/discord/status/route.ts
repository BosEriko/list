import FirebaseAdmin from "@lib/FirebaseAdmin";

const websiteUrl = "https://list.boseriko.com";
const COOLDOWN_MS = 5 * 60 * 1000;

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
      if (type === "movie") return "🎬 Watched";
      const action = actionVerbs[type];
      const verb = type === "manga" ? "Read" : type === "game" ? "Played" : "Watched";
      return `▶️ ${capitalize(verb)} ${action} ${count}`;
    default:
      return "📺 Updated";
  }
}

async function checkCooldown(uid: string) {
  if (!uid) {
    return { ok: false };
  }

  const database = FirebaseAdmin.firestore();
  const reference = database.collection("userActivities").doc(uid);
  const userActivity = await ref.get();

  if (!userActivity.exists) {
    await reference.set({
      lastListingUpdate: FirebaseAdmin.firestore.Timestamp.now()
    });
    return { ok: true };
  }

  const lastUpdate = userActivity.data()?.lastListingUpdate?.toMillis() || 0;
  const now = Date.now();

  if (now - lastUpdate < COOLDOWN_MS) {
    return { ok: false };
  }

  await reference.update({ lastListingUpdate: FirebaseAdmin.firestore.Timestamp.now() });
  return { ok: true };
}

export async function POST(req: Request) {
  const { payload, user } = await req.json();
  const { uid, username, avatar_url } = user;

  if (!payload) {
    return new Response(
      JSON.stringify({ error: "Missing payload" }),
      { status: 400 }
    );
  }

  const cooldown = await checkCooldown(uid);
  if (!cooldown.ok) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
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
