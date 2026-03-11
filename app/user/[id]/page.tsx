import Template from "@template";

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@lib/Firebase";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function User({ params }: PageProps) {
  const { id } = await params;

  const listingsQuery = query(
    collection(db, "listings"),
    where("userId", "==", id)
  );

  const snapshot = await getDocs(listingsQuery);

  const listings = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return (
    <Template.Default>
      <h1>User Profile</h1>

      <pre>{JSON.stringify(listings, null, 2)}</pre>
    </Template.Default>
  );
}
