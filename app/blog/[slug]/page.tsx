import Template from "@template";
import Atom from "@atom";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";

type Post = {
  id: number;
  title: string;
  description: string;
  cover_image: string | null;
  social_image?: string;
  published_at: string;
  tags: string[];
  body_markdown: string;
  body_html: string;
  url: string;
  reading_time_minutes: number;
  public_reactions_count: number;
  comments_count: number;
};

interface PageProps {
  params: any;
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;

  try {
    const res = await fetch(`https://dev.to/api/articles/boseriko/${slug}`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch post: ${res.status}`);
    }

    const post: Post = await res.json();
    const cover = post.cover_image || post.social_image;

    return (
      <Template.Default>
        <Head>
          <title>{post.title}</title>
          <meta name="description" content={post.description} />
          <link rel="canonical" href={post.url} />
          <meta property="og:title" content={post.title} />
          <meta property="og:description" content={post.description} />
          <meta property="og:image" content={cover || ""} />
          <meta property="og:url" content={post.url} />
          <meta property="og:type" content="article" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={post.title} />
          <meta name="twitter:description" content={post.description} />
          <meta name="twitter:image" content={cover || ""} />
        </Head>

        <div className="p-8 font-sans max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center mb-3">
            {(post.tags || []).map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>

          <div className="text-gray-500 text-sm text-center mb-2">
            <span>
              {new Date(post.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="font-bold"> &middot; </span>
            <span>{post.reading_time_minutes} min read</span>
          </div>

          <h1 className="text-3xl font-bold text-center mb-10">{post.title}</h1>

          <div className="rounded-t-lg bg-white border-t border-x border-gray-200 overflow-hidden -mb-5">
            {cover && (
              <img
                src={cover}
                alt={post.title}
                className="w-full h-64 object-cover align-baseline"
              />
            )}
          </div>

          <div className="border-b border-x rounded-b-lg rounded-x-lg bg-white border-gray-200">
            <Atom.Markdown content={post.body_html} />
            <div className="pb-5 px-5 flex gap-4">
              <a
                href={`${post.url}`}
                target="_blank"
                className="flex gap-2 text-gray-700 text-sm items-center bg-gray-100 px-3 py-2 rounded cursor-pointer hover:bg-[#f7b43d] transition-all group"
              >
                <FontAwesomeIcon
                  icon={faHeart}
                  className="text-[#f7b43d] group-hover:text-gray-700"
                />
                <span>{post.public_reactions_count}</span>
                <span>Reaction{post.public_reactions_count > 1 && "s"}</span>
              </a>
              <a
                href={`${post.url}#comments`}
                target="_blank"
                className="flex gap-2 text-gray-700 text-sm items-center bg-gray-100 px-3 py-2 rounded cursor-pointer hover:bg-[#f7b43d] transition-all group"
              >
                <FontAwesomeIcon
                  icon={faComment}
                  className="text-[#f7b43d] group-hover:text-gray-700"
                />
                <span>{post.comments_count}</span>
                <span>Comment{post.comments_count > 1 && "s"}</span>
              </a>
            </div>
          </div>

          <div className="mt-5 flex justify-between">
            <a
              href="#"
              className="px-6 py-2 rounded-md border-2 border-[#f7b43d] bg-transparent text-[#f7b43d] font-bold transition-all duration-300 ease-out
                       hover:-translate-y-1 shadow-md hover:shadow-lg cursor-pointer"
            >
              Back to Top
            </a>
            <a
              href="/blog"
              className="px-6 py-2 rounded-md border-2 border-[#f7b43d] bg-[#f7b43d] text-gray-700 font-bold transition-all duration-300 ease-out
                       hover:-translate-y-1 shadow-md hover:shadow-lg cursor-pointer"
            >
              Back to Blogs
            </a>
          </div>
        </div>
      </Template.Default>
    );
  } catch (err) {
    console.error(err);
    return (
      <Template.Default>
        <div className="p-8 font-sans">
          <p>No content found or an error occurred.</p>
        </div>
      </Template.Default>
    );
  }
}
