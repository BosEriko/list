import FirebaseAdmin from "@lib/FirebaseAdmin";
import { serverTimestamp } from "firebase-admin/firestore";
import { z, ZodObject, ZodRawShape } from "zod";

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

function CreateService<TSchema extends ZodObject<ZodRawShape>>(opts: {
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

    const result = schema.safeParse(doc.data());

    if (!result.success || typeof result.data !== "object" || result.data === null) return null;

    return {
      id: doc.id,
      ...result.data,
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

    async create(data: T, id?: string): Promise<WithId | null> {
      const dataWithTimestamp = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const parsed = schema.parse(dataWithTimestamp) as FirebaseFirestore.DocumentData;

      let docRef: FirebaseFirestore.DocumentReference;

      if (id) {
        docRef = collection.doc(id);

        const existingDoc = await docRef.get();
        if (existingDoc.exists) {
          throw new Error(`Document with ID ${id} already exists!`);
        }

        await docRef.set(parsed);
      } else {
        docRef = await collection.add(parsed);
      }

      const docSnap = await docRef.get();
      if (!docSnap.exists) return null;

      const result = schema.safeParse(docSnap.data());
      if (!result.success || typeof result.data !== "object" || result.data === null) return null;

      return {
        id: docSnap.id,
        ...result.data,
      };
    },

    async update(id: string, data: Partial<T>): Promise<void> {
      const dataWithTimestamp = {
        ...data,
        updatedAt: serverTimestamp(),
      };

      const partialSchema = schema.partial();
      const parsed = partialSchema.parse(dataWithTimestamp);

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

export default CreateService;
