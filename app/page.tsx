import Template from "@template";
import Organism from "@organism";

export async function generateMetadata() {
  return {
    title: `Welcome to Bos Eriko List`,
    description: `Welcome to Bos Eriko List`,
    openGraph: {
      title: `Welcome to Bos Eriko List`,
      description: `Welcome to Bos Eriko List`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Welcome to Bos Eriko List`,
      description: `Welcome to Bos Eriko List`,
    },
  };
}

export default async function Home() {
  return (
    <Template.Default>
      <Organism.Feed />
    </Template.Default>
  );
}
