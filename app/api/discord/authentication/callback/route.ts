import { NextResponse } from "next/server";

import generateDiscordToken from "./generateDiscordToken";
import fetchUser from "./fetchUser";
import syncFirebaseUser from "./syncFirebaseUser";
import generateFirebaseToken from "./generateFirebaseToken";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  const discord_token = await generateDiscordToken(code);
  const user = await fetchUser(discord_token);
  await syncFirebaseUser(user);
  const firebase_token = await generateFirebaseToken(user)

  const response = NextResponse.redirect(new URL(`/authenticate?token=${firebase_token}`, req.url));
  return response;
}
