import FirebaseAdmin from "@lib/FirebaseAdmin";
import TimestampConverter from "@lib/TimestampConverter";
import UserActivity from "@model/UserActivity";
import MediaType from "@type/MediaType";
import { UserActivityType } from "@schema";

const COOLDOWN_MS = 5 * 60 * 1000;

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function buildDescription(payload: {
  status: number;
  type: MediaType;
  count: number;
}) {
  const { status, type, count } = payload;

  const actionVerbs: Record<typeof type, string> = {
    anime: "episode",
    manga: "chapter",
  };

  switch (status) {
    case 3:
      return "✅ Finished";
    case 0:
      return "❌ Dropped";
    case 5:
      return "⏸️ Paused";
    case 2:
      return `⭐ Planning to ${type === "manga" ? "read" : "watch"}`;
    case 1:
    case 4:
      const action = actionVerbs[type];
      const verb = type === "manga" ? "Read" : "Watched";
      return `▶️ ${capitalize(verb)} ${action} ${count}`;
    default:
      return "📺 Updated";
  }
}

async function checkCooldown(uid: string) {
  if (!uid) return { ok: false };

  const userActivity: UserActivityType | null = await UserActivity.find(uid);

  if (!userActivity) {
    await UserActivity.create({ lastListingUpdate: FirebaseAdmin.firestore.FieldValue.serverTimestamp() }, uid);
    return { ok: true };
  }

  const lastUpdate = TimestampConverter(userActivity.lastListingUpdate);
  const now = Date.now();

  if (now - lastUpdate < COOLDOWN_MS) {
    return { ok: false };
  }

  await UserActivity.update({ lastListingUpdate: new Date() }, uid);

  return { ok: true };
}

async function post_listing_update_to_discord(payload: {
  title: string;
  count: number;
  status: number;
  type: MediaType;
  listingUrl: string;
  imageUrl?: string;
}, user: { uid: string; name: string; picture?: string }) {

  const cooldown = await checkCooldown(user.uid);
  if (!cooldown.ok) return { ok: false, cooldown: true };

  const embed = {
    title: payload.title,
    url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}${payload.listingUrl}`,
    description: buildDescription(payload),
    thumbnail: payload.imageUrl ? { url: payload.imageUrl } : undefined,
  };

  await fetch(process.env.DISCORD_STATUS_WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: user.name,
      avatar_url: user.picture,
      embeds: [embed],
    }),
  });

  return { ok: true };
}

export default post_listing_update_to_discord;
