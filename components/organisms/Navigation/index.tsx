"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

import * as Tooltip from "@radix-ui/react-tooltip";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileLines,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/topic/product" },
    { label: "Projects", path: "/topic/project" },
    { label: "Blogs", path: "/blog" },
    { label: "Connect", path: "/connect" },
  ];

  return (
    <nav className="relative z-50">
      <div className="flex items-center justify-between md:hidden py-4">
        <button
          className="px-3 py-2 rounded bg-[#f7b43d] text-white"
          onClick={() => setOpen((v) => !v)}
        >
          <FontAwesomeIcon icon={faBars} className="text-md" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex flex-col items-center justify-center gap-6 md:hidden text-white">
          {items.map((item) => (
            <button
              key={item.path}
              className="text-2xl px-6 py-3 hover:text-[#f7b43d] transition"
              onClick={() => {
                router.push(item.path);
                setOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}

          <button
            className="px-8 py-3 rounded-full bg-[#f7b43d] text-white text-2xl hover:bg-white hover:text-gray-700 transition"
            onClick={() => {
              () => window.open("/resume", "_blank");
              setOpen(false);
            }}
          >
            Resume
          </button>

          <button
            className="absolute top-4 right-4 text-3xl"
            onClick={() => setOpen(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="text-lg" />
          </button>
        </div>
      )}

      <ul className="hidden md:flex md:items-center">
        {items.map((item) => {
          const isActive = pathname === item.path;
          return (
            <li key={item.path} className="border-l border-gray-200">
              <button
                className={`${isActive ? "border-t-[#f7b43d]" : "border-t-white"} px-7 py-4 hover:bg-[#f7b43d] cursor-pointer hover:text-gray-700 transition-all border-y-5 border-b-white hover:border-y-[#f7b43d]`}
                onClick={() => router.push(item.path)}
              >
                {item.label}
              </button>
            </li>
          );
        })}

        <li className=" border-x border-gray-200">
          <Tooltip.Provider delayDuration={0}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  className="px-7 py-4 text-[#f7b43d] hover:bg-[#f7b43d] hover:text-gray-700 cursor-pointer transition-all border-y-5 border-y-white hover:border-y-[#f7b43d]"
                  onClick={() => window.open("/resume", "_blank")}
                >
                  <FontAwesomeIcon icon={faFileLines} className="text-lg" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="top"
                  sideOffset={8}
                  className="
                    z-50
                    rounded-md
                    bg-[#333]
                    px-3 py-1.5
                    text-xs font-medium text-white
                    shadow-lg
                    animate-in fade-in zoom-in-95
                    data-[state=closed]:animate-out
                    data-[state=closed]:fade-out
                    data-[state=closed]:zoom-out-95
                  "
                >
                  Resume
                  <Tooltip.Arrow className="fill-[#333]" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
