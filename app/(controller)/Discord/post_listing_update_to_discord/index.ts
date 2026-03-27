import FirebaseAdmin from "@lib/FirebaseAdmin";
import UserActivity from "@model/UserActivity";
import { UserActivityType } from "@schema";

const websiteUrl = "https://list.boseriko.com";
const COOLDOWN_MS = 5 * 60 * 1000;

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function isFirestoreTimestamp(ts: unknown): ts is FirebaseAdmin.firestore.Timestamp {
  return (
    typeof ts === "object" &&
    ts !== null &&
    "toDate" in ts &&
    typeof (ts as any).toDate === "function"
  );
}

function toMillis(ts?: UserActivityType["lastListingUpdate"]): number {
  if (!ts) return 0;
  if (isFirestoreTimestamp(ts)) return ts.toDate().getTime();
  if (ts instanceof Date) return ts.getTime();
  if (ts === FirebaseAdmin.firestore.FieldValue.serverTimestamp()) return 0;
  return 0;
}

function buildDescription(payload: {
  status: number;
  type: "anime" | "manga" | "game";
  count: number;
}) {
  const { status, type, count } = payload;

  const actionVerbs: Record<typeof type, string> = {
    anime: "episode",
    manga: "chapter",
    game: "progress",
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
      const action = actionVerbs[type];
      const verb = type === "manga" ? "Read" : type === "game" ? "Played" : "Watched";
      return `▶️ ${capitalize(verb)} ${action} ${count}`;
    default:
      return "📺 Updated";
  }
}

async function checkCooldown(uid: string) {
  if (!uid) return { ok: false };

  const userActivity: UserActivityType | null = await UserActivity.find(uid);

  if (!userActivity) {
    await UserActivity.create(
      { lastListingUpdate: FirebaseAdmin.firestore.FieldValue.serverTimestamp() },
      uid
    );
    return { ok: true };
  }

  const lastUpdate = toMillis(userActivity.lastListingUpdate);
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
  type: "anime" | "manga" | "game";
  listingUrl: string;
  imageUrl?: string;
}, user: { uid: string; username: string; avatar_url?: string }) {

  const cooldown = await checkCooldown(user.uid);
  if (!cooldown.ok) return { ok: false, cooldown: true };

  const embed = {
    title: payload.title,
    url: `${websiteUrl}${payload.listingUrl}`,
    description: buildDescription(payload),
    thumbnail: payload.imageUrl ? { url: payload.imageUrl } : undefined,
  };

  await fetch(process.env.DISCORD_STATUS_WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: user.username,
      avatar_url: user.avatar_url,
      embeds: [embed],
    }),
  });

  return { ok: true };
}

export default post_listing_update_to_discord;
