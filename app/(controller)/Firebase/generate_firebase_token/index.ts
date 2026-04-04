import FirebaseAdmin from "@lib/FirebaseAdmin";

const generate_firebase_token = async (user: any) => {
  return FirebaseAdmin.auth().createCustomToken(user?.id, {
    displayName: user?.username,
    profileImage: `https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.png`,
  });
};

export default generate_firebase_token;
