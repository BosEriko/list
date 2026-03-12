import Template from "@template";
import Molecule from "@molecule";

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@lib/Firebase";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

interface Listing {
  itemId: string;
  type: string;
  title: string;
  count: number;
  totalCount: number | null;
  imageUrl: string;
  status: number;
  userId: string;
}

export default async function User({ params }: PageProps) {
  const { id } = await params;

  const listingsQuery = query(
    collection(db, "listings"),
    where("userId", "==", id)
  );

  const snapshot = await getDocs(listingsQuery);

  const listings: Listing[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Listing, "id">),
  }));

  return (
    <Template.Default>
      <h1>User Profile</h1>
      <table className="table-auto w-full border-separate border-spacing-y-2">
        <thead>
          <tr>
            <th></th>
            <th>Title</th>
            <th>Progress</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing, key) => (
            <Molecule.ListingEditor
              itemId={listing.itemId}
              type={listing.type}
              title={listing.title}
              count={listing.count}
              totalCount={listing.totalCount}
              imageUrl={listing.imageUrl}
              status={listing.status}
              isModal={false}
              key={key}
            />
          ))}
        </tbody>
      </table>
    </Template.Default>
  );
}
