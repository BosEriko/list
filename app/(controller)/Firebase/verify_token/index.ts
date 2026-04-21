import FirebaseAdmin from "@lib/FirebaseAdmin";

const verify_token = async (token: string) => {
  try {
    const decoded = await FirebaseAdmin.auth().verifyIdToken(token);

    return {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
      customClaims: decoded,
    };
  } catch (error) {
    throw new Error("Invalid or expired Firebase token");
  }
};

export default verify_token;
