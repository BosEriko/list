import { NextResponse } from "next/server";

// TODO: Move to its own file
const exchange_code = async (code: string) => {
  const request = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI!,
    }),
  });
  const result = await request.json();
  return result.access_token;
}

// TODO: Move to its own file
const fetch_user = async (token) => {
  const response = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  const token = await exchange_code(code);
  const user = await fetch_user(token);

  // TODO: Generate Firebase Token (https://github.com/BosEriko/boteriko/blob/master/app/controllers/Twitch/authentication_callback/generate_custom_token.js)
  console.log(user);

  // TODO: Point to /authenticate?=TOKEN then create a component to manage the token (https://github.com/BosEriko/plus/blob/master/src/app/authenticate/page.jsx)
  const response = NextResponse.redirect(new URL("/", req.url));
  return response;
}
