import FirebaseAdmin from "@lib/FirebaseAdmin";

const generate_token = async (user: any) => {
  return FirebaseAdmin.auth().createCustomToken(user?.id, {
    displayName: user?.username,
    profileImage: `https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.png`,
  });
};

export default generate_token;
