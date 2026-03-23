import Template from "@template";
import User from "@model/User";
import ListingTable from "./ListingTable";
import ListingStatusOptions from '@constant/ListingStatusOptions';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    type?: "anime" | "manga" | "game" | "movie";
    status?: string;
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

export default async function UserPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const search = searchParams ? await searchParams : {};
  const typeFilter = search.type || "anime";
  const statusFilter = search.status ? parseInt(search.status) : 1;

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

  const typeOptions: Array<"anime" | "manga" | "game" | "movie"> = ["anime", "manga", "game", "movie"];

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
            <div className="flex flex-wrap gap-2 mt-2">
              {ListingStatusOptions[typeFilter].map((s) => (
                <a
                  key={s.value}
                  href={`?status=${s.value}&type=${typeFilter}`}
                  className={`px-3 py-1 rounded-md text-sm ${statusFilter === s.value ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <div className="bg-white border border-gray-200 rounded-md p-5 flex flex-col gap-3">
            <div className="flex gap-2 mb-2">
              {/* TODO: Remove "game" and "movie" filter when they are available */}
              {typeOptions.filter((t) => t !== "game" && t !== "movie").map((t) => (
                <a
                  key={t}
                  href={`?type=${t}&status=${statusFilter}`}
                  className={`px-3 py-1 rounded-md text-sm ${typeFilter === t ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"}`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </a>
              ))}
            </div>
            <ListingTable type={typeFilter} status={statusFilter} id={id} />
          </div>
        </div>
      </div>
    </Template.Default>
  );
}
