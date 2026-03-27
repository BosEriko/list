import { z } from "zod";

function firestoreTimestampToDate(val: unknown) {
  if (
    val &&
    typeof val === "object" &&
    "toDate" in val &&
    typeof (val as any).toDate === "function"
  ) {
    return (val as FirebaseFirestore.Timestamp).toDate();
  }

  return val;
}

const UserActivitySchema = z.object({
  lastListingUpdate: z.preprocess(firestoreTimestampToDate, z.date()),
});

export default UserActivitySchema;
