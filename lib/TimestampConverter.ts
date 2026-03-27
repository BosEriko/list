import FirebaseAdmin from "./FirebaseAdmin";

function isFirestoreTimestamp(ts: unknown): ts is FirebaseAdmin.firestore.Timestamp {
  return (
    typeof ts === "object" &&
    ts !== null &&
    "toDate" in ts &&
    typeof (ts as any).toDate === "function"
  );
}

function TimestampConverter(ts?: unknown): number {
  if (!ts) return 0;
  if (isFirestoreTimestamp(ts)) return ts.toDate().getTime();
  if (ts instanceof Date) return ts.getTime();
  if (ts === FirebaseAdmin.firestore.FieldValue.serverTimestamp()) return 0;
  return 0;
}

export default TimestampConverter;
