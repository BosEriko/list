import Template from "@template";
import Atom from "@atom";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";

type Post = {
  id: number;
  title: string;
  slug: string;
  description: string;
  cover_image: string | null;
  social_image: string;
  published_at: string;
  readable_publish_date: string;
  tag_list: string[];
  url: string;
  path: string;
  reading_time_minutes: number;
  comments_count: number;
  public_reactions_count: number;
};

interface PageProps {
  searchParams: any;
}

export default async function Blog({ searchParams }: PageProps) {
  const awaitedSearchParams = await searchParams;
  const page = Number(awaitedSearchParams.page ?? 1);
  const perPage = 12;

  const res = await fetch(
    `https://dev.to/api/articles?username=boseriko&page=${page}&per_page=${perPage}`,
    { next: { revalidate: 86400 } },
  );

  const nextRes = await fetch(
    `https://dev.to/api/articles?username=boseriko&page=${page + 1}&per_page=${perPage}`,
    { next: { revalidate: 86400 } },
  );
  const nextData = nextRes.ok ? await nextRes.json() : [];

  if (!res.ok) {
    throw new Error("Failed to fetch blog posts");
  }

  if (!nextRes.ok) {
    throw new Error("Failed to check if there's a next page");
  }

  const data = await res.json();

  const posts: Post[] = Array.isArray(data) ? data : [];
  const hasNext: boolean = Boolean(
    Array.isArray(nextData) && nextData.length > 0,
  );

  return (
    <Template.Default>
      <div className="text-center space-y-4 container mx-auto my-10 px-5">
        <h1 className="font-bold text-4xl">Blog</h1>
        <h4 className="text-gray-500">
          <span>I write stuff on </span>
          <a
            href="https://dev.to/boseriko"
            target="_blank"
            className="bg-yellow-300 texty-gray-700 px-1"
          >
            dev.to
          </a>
        </h4>

        {posts.length === 0 ? (
          <p>No blog posts found.</p>
        ) : (
          <>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {posts.map((post) => {
                const cover = post.cover_image || post.social_image;

                return (
                  <li key={post.slug}>
                    <Atom.Card url={`/blog/${post.slug}`} coverPhotoUrl={cover}>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {(post.tag_list || []).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-gray-100 px-2 py-1 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <h2 className="text-xl font-semibold">
                        {post.title}
                      </h2>

                      <div className="text-sm text-gray-500 mb-3">
                        <span>
                          {new Date(post.published_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </span>
                        <span className="font-bold"> &middot; </span>
                        <span>{post.reading_time_minutes} min read</span>
                      </div>

                      <div className="text-gray-600">
                        {post.description}
                      </div>

                      <div className="absolute left-5 bottom-5 right-5">
                        <div className="flex gap-4 text-gray-700">
                          <div className="flex gap-1 text-xs items-center">
                            <FontAwesomeIcon icon={faHeart} />
                            <span>{post.public_reactions_count}</span>
                            <span>
                              Reaction
                              {post.public_reactions_count > 1 && "s"}
                            </span>
                          </div>
                          <div className="flex gap-2 text-xs items-center">
                            <FontAwesomeIcon icon={faComment} />
                            <span>{post.comments_count}</span>
                            <span>Comment{post.comments_count > 1 && "s"}</span>
                          </div>
                        </div>
                      </div>
                    </Atom.Card>
                  </li>
                );
              })}
            </ul>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link href={`/blog?page=${Math.max(1, page - 1)}`}>
                <button
                  disabled={page === 1}
                  className="
                    border rounded-lg bg-white border-gray-200 cursor-pointer
                    transition-all duration-300 ease-in-out
                    px-3 py-2
                    hover:border-[#f7b43d]
                    disabled:cursor-not-allowed
                    disabled:bg-gray-100
                    disabled:border-gray-300
                    disabled:text-gray-400
                  "
                >
                  Previous
                </button>
              </Link>

              <span>Page {page}</span>

              <Link href={`/blog?page=${page + 1}`}>
                <button
                  disabled={!hasNext}
                  className="
                    border rounded-lg bg-white border-gray-200 cursor-pointer
                    transition-all duration-300 ease-in-out
                    px-3 py-2
                    hover:border-[#f7b43d]
                    disabled:cursor-not-allowed
                    disabled:bg-gray-100
                    disabled:border-gray-300
                    disabled:text-gray-400
                  "
                >
                  Next
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </Template.Default>
  );
}
