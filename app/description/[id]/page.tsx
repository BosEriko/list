import Template from "@template";
import Atom from "@atom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines, faArrowRight } from '@fortawesome/free-solid-svg-icons'

interface Repo {
  description: string;
  name: string;
  homepage: string;
  updated_at: string;
  stargazers_count: number;
  html_url: string;
  topics: string[];
  full_name: string;
  default_branch: string;
}

interface PageProps {
  params: any;
}

export default async function Description({ params }: PageProps) {
  const { id } = await params;
  const revalidate = 86400;
  const portfolioURL = `https://api.github.com/repos/boseriko/${id}/contents/PORTFOLIO.md`;
  const repoURL = `https://api.github.com/repos/boseriko/${id}`;

  try {
    const [contentRes, repoRes] = await Promise.all([
      fetch(portfolioURL, {
        next: { revalidate },
      }),
      fetch(repoURL, {
        next: { revalidate },
      }),
    ]);

    if (!contentRes.ok) {
      return (
        <Template.Default>
          <div className="text-center">
            <span>No PORTFOLIO.md found. </span>
            <span>Make sure the repository has </span>
            <span>PORTFOLIO.md on the root directory.</span>
          </div>
        </Template.Default>
      );
    }

    const contentJson = await contentRes.json();
    const repoJson: Repo = await repoRes.json();

    const content = Buffer.from(contentJson.content, "base64").toString(
      "utf-8",
    );

    const type: string = repoJson?.topics?.includes("product")
      ? "product"
      : "project";
    const topics: string[] = (repoJson?.topics ?? []).filter(
      (topic: any) => topic !== "product" && topic !== "project",
    );
    const name: string = repoJson.name;
    const updated_at: string = repoJson.updated_at;
    const homepage: string = repoJson.homepage;
    const stargazers_count: number = repoJson.stargazers_count;
    const html_url: string = repoJson.html_url;
    const description: string = repoJson.description;
    const full_name: string = repoJson.full_name;
    const default_branch: string = repoJson.default_branch;

    return (
      <Template.Default orientation="minimal" backgroundColor="white">
        <div className="px-4 py-10">
          <Atom.Visibility state={!!(topics.length > 0)}>
            <ul className="flex flex-wrap gap-2 justify-center mb-3">
              {topics.map((topic) => (
                <li key={topic}>
                  <a
                    href={`/topic/${topic}`}
                    target="_blank"
                    className="text-xs bg-gray-100 px-2 py-1 rounded"
                  >
                    #{topic}
                  </a>
                </li>
              ))}
            </ul>
          </Atom.Visibility>

          <div className="text-gray-500 text-sm text-center mb-3">
            <span>
              <span>Updated at </span>
              {new Date(updated_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <Atom.Visibility state={!!homepage}>
              <span className="font-bold"> &middot; </span>
              <span>
                <a href={homepage} target="_blank" className="hover:underline">
                  {homepage?.replace(/^https?:\/\//, "")}
                </a>
              </span>
            </Atom.Visibility>
            <span className="font-bold"> &middot; </span>
            <span>
              <a href={html_url} target="_blank" className="hover:underline">
                {stargazers_count} star{stargazers_count > 1 && "s"}
              </a>
            </span>
          </div>

          <h1 className="text-3xl font-bold text-center mb-3">{name}</h1>

          <h4 className="text-center mb-10 text-md text-gray-500 max-w-175 mx-auto">
            {description}
          </h4>

          <div className="mx-auto max-w-300">
            <img src={`https://raw.githubusercontent.com/${full_name}/${default_branch}/COVER.png`} className="w-full rounded-lg shadow-lg border-3 border-[#f7b43d]" />
          </div>

          <div className="mx-auto max-w-250 p-5">
            <Atom.Markdown content={content} />
          </div>

          <div className="mx-auto max-w-300 bg-[#f7b43d] rounded-md mt-5 p-10 text-center text-white flex flex-col gap-5 shadow-lg">
            <h2 className="font-bold text-4xl">Like what you see?</h2>
            <p className="font-bold text-xl">Let's work together and make your ideas come to life!<br />Or maybe view more of my {type.charAt(0).toUpperCase() + type.slice(1)}s?</p>
            <div className="flex flex-row gap-5 justify-center">
              <a
                href={`/resume`}
                target="_blank"
                className="px-6 py-2 rounded-md border-2 border-white bg-white text-[#f7b43d] font-bold transition-all duration-300 ease-out
                        hover:-translate-y-1 flex gap-1 items-center"
              >
                <FontAwesomeIcon icon={faFileLines} />
                <span>Check Resume</span>
              </a>
              <a
                href={`/topic/${type}`}
                className="px-6 py-2 rounded-md border-2 border-white bg-[#f7b43d] text-white font-bold transition-all duration-300 ease-out
                        hover:-translate-y-1 flex gap-1 items-center"
              >
                <FontAwesomeIcon icon={faArrowRight} />
                <span>See More {type.charAt(0).toUpperCase() + type.slice(1)}s</span>
              </a>
            </div>
          </div>
        </div>
      </Template.Default>
    );
  } catch (err) {
    console.error(err);
    return (
      <Template.Default>
        <div className="p-8 font-sans">
          <p>Failed to fetch PORTFOLIO.md</p>
        </div>
      </Template.Default>
    );
  }
}
