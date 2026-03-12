import Template from "@template";
import Molecule from "@molecule";
import FirebaseAdmin from "@lib/FirebaseAdmin";

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
  listingUrl: string;
  status: number;
  userId: string;
}

interface User {
  uid: string;
  username: string;
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export default async function UserPage({ params }: PageProps) {
  const { id } = await params;

  let user: User | null = null;
  try {
    const firebaseUser = await FirebaseAdmin.auth().getUser(id);
    
    const userDoc = await FirebaseAdmin.firestore().collection("users").doc(id).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    user = {
      uid: firebaseUser.uid,
      username: userData?.username || firebaseUser.displayName || "Unknown",
      avatarUrl: userData?.avatarUrl || firebaseUser.photoURL || "",
      createdAt: firebaseUser.metadata.creationTime ? new Date(firebaseUser.metadata.creationTime) : new Date(),
      updatedAt: firebaseUser.metadata.lastSignInTime ? new Date(firebaseUser.metadata.lastSignInTime) : new Date(),
    };
  } catch (err) {
    console.error("User not found:", err);
    return (
      <Template.Default>
        <p>User not found.</p>
      </Template.Default>
    );
  }

  const listingsSnapshot = await FirebaseAdmin.firestore().collection("listings").where("userId", "==", id).get();

  const listings: Listing[] = listingsSnapshot.docs.map((doc) => ({
    itemId: doc.id,
    ...(doc.data() as Omit<Listing, "itemId">),
  }));

  return (
    <Template.Default>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col gap-4 lg:w-[300px] w-full">
          <div className="bg-white border border-gray-200 rounded-md p-5 flex flex-col gap-3 items-center">
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="w-24 h-24 rounded-full object-cover"
            />
            <h2 className="text-lg font-semibold">{user.username}</h2>
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <div className="bg-white border border-gray-200 rounded-md p-5">
            <table className="table-auto w-full border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th></th>
                  <th className="text-left">Title</th>
                  <th className="text-left w-px">Progress</th>
                  <th className="text-left w-px">Status</th>
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
                    listingUrl={listing.listingUrl}
                    status={listing.status}
                    isModal={false}
                    key={key}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Template.Default>
  );
}
