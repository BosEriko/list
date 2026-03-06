import Template from "@template";
import Atom from "@atom";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faCodeBranch, faStar } from "@fortawesome/free-solid-svg-icons";

type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  language: string;
  node_id: string;
  full_name: string;
  default_branch: string;
};

const pageDescription: Record<string, { title: string; description: string }> =
  {
    product: {
      title: "Product",
      description: "These are repositories that I work on constantly.",
    },
    project: {
      title: "Project",
      description: "These are repositories that I work on every now and then.",
    },
    typescript: {
      title: "TypeScript",
      description: "Repositories related to TypeScript.",
    },
    ruby: {
      title: "Ruby",
      description: "Repositories related to Ruby.",
    },
    elixir: {
      title: "Elixir",
      description: "Repositories related to Elixir.",
    },
    php: {
      title: "PHP",
      description: "Repositories related to PHP.",
    },
    react: {
      title: "React",
      description: "Repositories related to React.",
    },
    nextjs: {
      title: "Next.js",
      description: "Repositories related to Next.js.",
    },
    nodejs: {
      title: "Node.js",
      description: "Repositories related to Node.js.",
    },
    rails: {
      title: "Rails",
      description: "Repositories related to Rails.",
    },
    graphql: {
      title: "GraphQL",
      description: "Repositories related to GraphQL.",
    },
    docker: {
      title: "Docker",
      description: "Repositories related to Docker.",
    },
    tailwind: {
      title: "Tailwind",
      description: "Repositories related to Tailwind.",
    },
    postgresql: {
      title: "PostgreSQL",
      description: "Repositories related to PostgreSQL.",
    },
    mysql: {
      title: "MySQL",
      description: "Repositories related to MySQL.",
    },
  };

interface PageProps {
  params: any;
  searchParams: any;
}

export default async function Topic({ params, searchParams }: PageProps) {
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;
  const topic = awaitedParams.topic;
  const page = Number(awaitedSearchParams.page ?? 1);
  const perPage = 12;

  const res = await fetch(
    `https://api.github.com/search/repositories?q=user:boseriko+topic:${topic}&sort=updated&order=desc&page=${page}&per_page=${perPage}`,
    {
      next: { revalidate: 86400 },
    },
  );

  const data = await res.json();

  const repos: Repo[] = data.items ?? [];
  const totalCount: number = data.total_count ?? 0;
  const totalPages = Math.ceil(totalCount / perPage);

  return (
    <Template.Default>
      <div className="text-center space-y-4 container mx-auto my-10 px-5">
        <h1 className="font-bold text-4xl">
          {pageDescription[topic]?.title ?? "Unknown Topic"}
        </h1>

        <h4 className="text-gray-500">
          <span>
            {pageDescription[topic]?.description ?? "Unknown Description"}
          </span>
          <span> Find more at my </span>
          <a
            href="https://github.com/BosEriko"
            target="_blank"
            className="bg-yellow-300 texty-gray-700 px-1"
          >
            GitHub
          </a>
        </h4>

        {repos.length === 0 ? (
          <p>No Repository found.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {repos.map((repo) => (
              <li key={repo.id}>
                <Atom.Card url={`/description/${repo.name}`} coverPhotoUrl={`https://raw.githubusercontent.com/${repo.full_name}/${repo.default_branch}/COVER.png`} fallbackCoverPhotoUrl={`https://opengraph.githubassets.com/${repo.node_id}/${repo.full_name}`}>
                  <h2 className="font-bold text-lg">{repo.name}</h2>

                  <p className="line-clamp-2">{repo.description}</p>

                  <div className="absolute left-5 bottom-5 right-5">
                    <div className="flex justify-between items-center">
                      <div className="text-xs bg-gray-100 rounded-full py-1 px-2">
                        {repo.language}
                      </div>

                      <div className="text-xs flex items-center gap-2 text-gray-400">
                        <div className="flex gap-1 items-center">
                          <FontAwesomeIcon icon={faEye} />
                          <span>{repo.watchers_count}</span>
                        </div>
                        <div className="flex gap-1 items-center">
                          <FontAwesomeIcon icon={faCodeBranch} />
                          <span>{repo.forks_count}</span>
                        </div>
                        <div className="flex gap-1 items-center">
                          <FontAwesomeIcon icon={faStar} />
                          <span>{repo.stargazers_count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Atom.Card>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href={`/topic/${topic}?page=${Math.max(1, page - 1)}`}>
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

          <Link href={`/topic/${topic}?page=${Math.min(totalPages, page + 1)}`}>
            <button
              disabled={page === totalPages}
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
      </div>
    </Template.Default>
  );
}
