import Template from "@template";
import Molecule from "@molecule";

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

      {listings.map((listing, key) => (
        <Molecule.ListingEditor
          itemId={listing.id}
          type={listing.type}
          title={listing.title}
          count={listing.count}
          totalCount={listing.totalCount}
          imageUrl={listing.imageUrl}
          isModal={false}
        />
      ))}
    </Template.Default>
  );
}
