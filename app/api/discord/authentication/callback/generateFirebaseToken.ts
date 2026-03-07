import FirebaseAdmin from "@lib/FirebaseAdmin";

const generateFirebaseToken = async (user) => {
  return FirebaseAdmin.auth().createCustomToken(user?.id, {
    displayName: user?.username,
    profileImage: `https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.png`,
  });
};

export default generateFirebaseToken;
