import Template from "@template";
import User from "@model/User";
import ListingStatus from "./ListingStatus";
import ListingTable from "./ListingTable";
import ListingType from "./ListingType";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

interface User {
  uid: string;
  username: string;
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;

  let user: Partial<User> = { username: "Unknown", avatarUrl: "" };
  try {
    const userDoc = await User.find(id);
    if (!!userDoc) {
      user = userDoc as User;
    }
  } catch (err) {
    console.error("User not found:", err);
  }

  return {
    title: `${user.username}’s Profile | Bos Eriko List`,
    description: `View all listings and progress of ${user.username} on Bos Eriko List.`,
    openGraph: {
      title: `${user.username}’s Profile | Bos Eriko List`,
      description: `View all listings and progress of ${user.username} on Bos Eriko List.`,
      images: [user.avatarUrl || ""],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${user.username}’s Profile | Bos Eriko List`,
      description: `View all listings and progress of ${user.username} on Bos Eriko List.`,
      images: [user.avatarUrl || ""],
    },
  };
}

export default async function UserPage({ params }: PageProps) {
  const { id } = await params;

  let user: any = null;
  try {
    const userDoc = await User.find(id);
    user = !!userDoc ? userDoc : {};
  } catch (err) {
    console.error("User not found:", err);
    return (
      <Template.Default>
        <p>User not found.</p>
      </Template.Default>
    );
  }

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
            <h2 className="text-lg font-semibold">@{user.username}</h2>
            <ListingStatus />
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <div className="bg-white border border-gray-200 rounded-md p-5 flex flex-col gap-3">
            <ListingType />
            <ListingTable id={id} />
          </div>
        </div>
      </div>
    </Template.Default>
  );
}
