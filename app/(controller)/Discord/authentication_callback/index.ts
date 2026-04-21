import DiscordController from "@controller/Discord";
import FirebaseController from "@controller/Firebase";

async function authentication_callback(code: string) {
  if (!code) {
    throw new Error("Missing Discord authorization code");
  }

  const discordToken = await DiscordController.generate_discord_token(code);
  const user = await DiscordController.fetch_discord_user(discordToken);
  await FirebaseController.sync_user(user);
  const firebaseToken = await FirebaseController.generate_token(user);

  return {
    discordUser: user,
    firebaseToken,
  };
}

export default authentication_callback;
