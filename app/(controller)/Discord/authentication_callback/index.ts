import generateDiscordToken from "@service/discord/generateDiscordToken";
import fetchDiscordUser from "@service/discord//fetchDiscordUser";
import syncFirebaseUser from "@service/firebase/syncFirebaseUser";
import generateFirebaseToken from "@service/firebase/generateFirebaseToken";

async function authentication_callback(code: string) {
  if (!code) {
    throw new Error("Missing Discord authorization code");
  }

  const discordToken = await generateDiscordToken(code);
  const user = await fetchDiscordUser(discordToken);
  await syncFirebaseUser(user);
  const firebaseToken = await generateFirebaseToken(user);

  return {
    discordUser: user,
    firebaseToken,
  };
}

export default authentication_callback;
