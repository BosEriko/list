import FirebaseAdmin from "@lib/FirebaseAdmin";
import { z, ZodTypeAny } from "zod";

type WhereOperator =
  | "=="
  | "!="
  | "<"
  | "<="
  | ">"
  | ">="
  | "array-contains"
  | "in"
  | "not-in"
  | "array-contains-any";

type WhereCondition<T> = {
  field: keyof T;
  operator: WhereOperator;
  value: any;
};

export function CreateService<TSchema extends ZodTypeAny>(opts: {
  collection: string;
  schema: TSchema;
}) {
  const { collection: collectionName, schema } = opts;

  type T = z.infer<TSchema>;
  type WithId = T & { id: string };

  const db = FirebaseAdmin.firestore();
  const collection = db.collection(collectionName);

  function parseDoc(doc: FirebaseFirestore.DocumentSnapshot): WithId | null {
    if (!doc.exists) return null;

    const parsed = schema.safeParse(doc.data());

    if (!parsed.success) {
      console.error("Zod parse error:", parsed.error);
      return null;
    }

    if (!parsed.success || typeof parsed.data !== "object" || parsed.data === null) return null;

    return {
      id: doc.id,
      ...parsed.data,
    };
  }

  function parseDocs(
    snapshot: FirebaseFirestore.QuerySnapshot
  ): WithId[] {
    return snapshot.docs
      .map(parseDoc)
      .filter((doc): doc is WithId => doc !== null);
  }

  return {
    async all(): Promise<WithId[]> {
      const snapshot = await collection.get();
      return parseDocs(snapshot);
    },

    async find(id: string): Promise<WithId | null> {
      const doc = await collection.doc(id).get();
      return parseDoc(doc);
    },

    async create(data: T, id?: string): Promise<WithId> {
      const parsed = schema.parse(data); // throws if invalid

      let docRef: FirebaseFirestore.DocumentReference;

      if (id) {
        docRef = collection.doc(id);
        await docRef.set(parsed as FirebaseFirestore.DocumentData);
      } else {
        docRef = await collection.add(parsed as FirebaseFirestore.DocumentData);
      }

      if (!parsed.success || typeof parsed.data !== "object" || parsed.data === null) return null;

      return {
        id: docRef.id,
        ...parsed,
      };
    },

    async update(id: string, data: Partial<T>): Promise<void> {
      const partialSchema = schema.partial();
      const parsed = partialSchema.parse(data);

      await collection.doc(id).update(parsed);
    },

    async destroy(id: string): Promise<void> {
      await collection.doc(id).delete();
    },

    async where(
      conditions: WhereCondition<T>[]
    ): Promise<WithId[]> {
      let query: FirebaseFirestore.Query = collection;

      for (const cond of conditions) {
        query = query.where(
          cond.field as string,
          cond.operator,
          cond.value
        );
      }

      const snapshot = await query.get();
      return parseDocs(snapshot);
    },

    async find_by(
      conditions: WhereCondition<T>[]
    ): Promise<WithId | null> {
      let query: FirebaseFirestore.Query = collection;

      for (const cond of conditions) {
        query = query.where(
          cond.field as string,
          cond.operator,
          cond.value
        );
      }

      const snapshot = await query.limit(1).get();

      if (snapshot.empty) return null;

      return parseDoc(snapshot.docs[0]);
    },
  };
}
