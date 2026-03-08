'use client';
import { useEffect } from 'react';
import useAuthStore from '@store/useAuthStore';
import Atom from '@atom';
import Template from "@template";
import Link from "next/link";

export default function Home() {
  const { user, loading, logout } = useAuthStore();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Template.Default orientation="center">
      <Atom.Visibility state={user === null}>
        <Link href="/api/discord/authentication/login">
          <button>Login with Discord</button>
        </Link>
      </Atom.Visibility>
      <Atom.Visibility state={user !== null}>
        <button onClick={() => logout()}>Log Out button here</button>
      </Atom.Visibility>
    </Template.Default>
  );
}
