import useAuthStore from "@store/useAuthStore";
import MediaType from "@type/MediaType";

interface Payload {
  title: string;
  count: number;
  status: number;
  type: MediaType;
  listingUrl: string;
  imageUrl?: string;
}

interface User {
  uid: string;
  displayName: string;
  photoURL: string;
}

async function UpdateDiscordStatus(payload: Payload) {
  const { user } = useAuthStore.getState() as { user: User | null };
  if (!user) return;

  await fetch("/api/discord/status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      payload,
      user,
    }),
  });
}

export default UpdateDiscordStatus;
