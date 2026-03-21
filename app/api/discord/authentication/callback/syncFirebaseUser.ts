import FirebaseAdmin from "@lib/FirebaseAdmin";
import User from "@model/User";

const syncFirebaseUser = async (user: any) => {
  const avatarUrl = `https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.png`;

  try {
    await FirebaseAdmin.auth().updateUser(user?.id, {
      email: user?.email,
      displayName: user?.username,
      photoURL: avatarUrl,
    });
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      await FirebaseAdmin.auth().createUser({
        uid: user?.id,
        email: user?.email,
        displayName: user?.username,
        photoURL: avatarUrl,
      });
    } else {
      throw new Error(`Failed to sync Firebase user: ${error.message}`);
    }
  }

  const firestoreUser = await User.find(user?.id);
  const data = {
    uid: user?.id,
    email: user?.email,
    username: user?.username,
    avatarUrl,
  }

  if (!!firestoreUser) {
    await User.update(user?.id, data);
  } else {
    await User.create(user?.id, data);
  }
};

export default syncFirebaseUser;
