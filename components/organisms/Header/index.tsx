"use client";
import useAuthStore from "@store/useAuthStore";
import { useRouter } from "next/navigation";
import Atom from "@atom";
import { Pixelify_Sans } from "next/font/google";
import { useState } from "react";
import Link from "next/link";

import { Button, Avatar, Dropdown } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["700"],
});

const Header = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const menuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: <Link href={`/user/${user?.uid}`}>Profile</Link>,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Log Out",
      onClick: () => logout(),
    },
  ];

  const Logo = () => (
    <button onClick={() => router.push("/")}>
      <h2 className={`${pixelify.className} text-3xl md:text-4xl font-bold text-[#f7b43d] cursor-pointer`}>BE</h2>
    </button>
  );

  const User = () => (
    <div className="flex items-center gap-3">
      <Atom.Visibility state={user === null}>
        <Link href="/api/discord/authentication/login">
          <a>
            <Button type="primary">Log In with Discord</Button>
          </a>
        </Link>
      </Atom.Visibility>
      <Atom.Visibility state={user !== null}>
        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
          <Avatar
            size={36}
            src={user?.photoURL ?? undefined}
            icon={<UserOutlined />}
            className="cursor-pointer"
          />
        </Dropdown>
      </Atom.Visibility>
    </div>
  );

  const Search = ({ className }: { className: string }) => {
    const [query, setQuery] = useState("");

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!query.trim()) return;
      router.push(`/search/${encodeURIComponent(query.trim())}`);
      setQuery("");
    };

    return (
      <div className={className}>
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative">
            <input
              type="text"
              placeholder="Search anime or manga..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 pr-9 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#f7b43d]"
            />
            <SearchOutlined className="absolute right-3 top-2.5 text-gray-400" />
          </div>
        </form>
      </div>
    );
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-3">
        <Logo />
        <Search className="flex-1 max-w-md hidden sm:block" />
        <User />
      </div>
      <Search className="px-4 pb-3 sm:hidden" />
    </header>
  );
};

export default Header;
