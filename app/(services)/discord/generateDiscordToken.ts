const generateDiscordToken = async (code: string) => {
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

  if (!request.ok) {
    throw new Error(`Failed to generate token: ${request.statusText}`);
  }

  const result = await request.json();
  return result.access_token;
};

export default generateDiscordToken;
