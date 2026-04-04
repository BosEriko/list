import DiscordController from "@controller/Discord";

import syncFirebaseUser from "@service/firebase/syncFirebaseUser";
import generateFirebaseToken from "@service/firebase/generateFirebaseToken";

async function authentication_callback(code: string) {
  if (!code) {
    throw new Error("Missing Discord authorization code");
  }

  const discordToken = await DiscordController.generate_discord_token(code);
  const user = await DiscordController.fetch_discord_user(discordToken);
  await syncFirebaseUser(user);
  const firebaseToken = await generateFirebaseToken(user);

  return {
    discordUser: user,
    firebaseToken,
  };
}

export default authentication_callback;
