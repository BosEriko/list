import { NextResponse } from "next/server";
import DiscordController from "@controller/Discord";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  try {
    const { firebaseToken } = await DiscordController.authentication_callback(code);

    const redirectUrl = new URL(`/authenticate?token=${firebaseToken}`, req.url);
    return NextResponse.redirect(redirectUrl);

  } catch (err) {
    console.error("Discord authentication error:", err);
    return new Response("Authentication failed", { status: 500 });
  }
}
