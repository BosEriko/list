import generateDiscordToken from "./generateDiscordToken";
import fetchUser from "./fetchUser";
import syncFirebaseUser from "./syncFirebaseUser";
import generateFirebaseToken from "./generateFirebaseToken";

async function authentication_callback(code: string) {
  if (!code) {
    throw new Error("Missing Discord authorization code");
  }

  const discordToken = await generateDiscordToken(code);
  const user = await fetchUser(discordToken);
  await syncFirebaseUser(user);
  const firebaseToken = await generateFirebaseToken(user);

  return {
    discordUser: user,
    firebaseToken,
  };
}

export default authentication_callback;
