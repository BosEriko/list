import { NextResponse } from 'next/server';
import DiscordController from "@controller/Discord";

export async function GET() {
  const authUrl = DiscordController.authentication_login();
  return NextResponse.redirect(authUrl);
}
