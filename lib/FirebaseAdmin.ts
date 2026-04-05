import * as FirebaseAdmin from 'firebase-admin';

if (!FirebaseAdmin.apps.length) {
  FirebaseAdmin.initializeApp({
    credential: FirebaseAdmin.credential.cert({
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      projectId: process.env.FIREBASE_PROJECT_ID!,
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID!}-default-rtdb.asia-southeast1.firebasedatabase.app/`
  });
}

export default FirebaseAdmin;
