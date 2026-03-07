import FirebaseAdmin from "@lib/FirebaseAdmin";

const syncFirebaseUser = async (user) => {
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


export default syncFirebaseUser;
