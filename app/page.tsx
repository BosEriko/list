import Template from "@template";
import Link from "next/link";

export default async function Home() {
  return (
    <div>
      <Link href="/api/discord/authentication/login">
        <button>Login with Discord</button>
      </Link>
    </div>
  );
}
