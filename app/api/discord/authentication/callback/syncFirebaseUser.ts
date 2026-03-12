import FirebaseAdmin from "@lib/FirebaseAdmin";

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

  const db = FirebaseAdmin.firestore();
  const userRef = db.collection("users").doc(user?.id);

  const doc = await userRef.get();

  await userRef.set(
    {
      uid: user?.id,
      email: user?.email,
      username: user?.username,
      avatarUrl,
      updatedAt: FirebaseAdmin.firestore.FieldValue.serverTimestamp(),
      ...(doc.exists ? {} : { createdAt: FirebaseAdmin.firestore.FieldValue.serverTimestamp() }),
    },
    { merge: true }
  );
};

export default syncFirebaseUser;
