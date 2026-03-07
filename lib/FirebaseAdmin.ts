import * as FirebaseAdmin from 'firebase-admin';

if (!FirebaseAdmin.apps.length) {
  FirebaseAdmin.initializeApp({
    credential: FirebaseAdmin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL!
  });
}

export default FirebaseAdmin;
