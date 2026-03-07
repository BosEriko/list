import { NextResponse } from "next/server";
import FirebaseAdmin from "@lib/FirebaseAdmin";

// TODO: Move to its own file
type User = {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner: string | null;
  accent_color: number;
  global_name: string;
  avatar_decoration_data: unknown | null;
  collectibles: unknown | null;
  display_name_styles: unknown | null;
  banner_color: string | null;
  clan: unknown | null;
  primary_guild: unknown | null;
  mfa_enabled: boolean;
  locale: string;
  premium_type: number;
  email: string;
};

// TODO: Move to its own file
const generate_token = async (code: string) => {
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
const fetch_user = async (token: string): Promise<User> => {
  const response = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.statusText}`);
  }

  const data: User = await response.json();
  return data;
};

// TODO: Move to its own file
const sync_firebase_user = async (user) => {
  try {
    await FirebaseAdmin.auth().updateUser(user?.id, {
      email: user?.email,
      displayName: user?.username,
      photoURL: `https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.png`,
    });
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      await FirebaseAdmin.auth().createUser({
        uid: user?.id,
        email: user?.email,
        displayName: user?.username,
        photoURL: `https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.png`,
      });
    } else {
      throw new Error(`Failed to sync Firebase user: ${error.message}`);
    }
  }
};

// TODO: Move to its own file
const generate_firebase_token = async (user) => {
  return FirebaseAdmin.auth().createCustomToken(user?.id, {
    displayName: user?.username,
    profileImage: `https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.png`,
  });
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  const token = await generate_token(code);
  const user = await fetch_user(token);
  await sync_firebase_user(user);
  const firebase_token = await generate_firebase_token(user)

  console.log(firebase_token);

  // TODO: Point to /authenticate?=TOKEN then create a component to manage the token (https://github.com/BosEriko/plus/blob/master/src/app/authenticate/page.jsx)
  const response = NextResponse.redirect(new URL("/", req.url));
  return response;
}
