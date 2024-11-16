"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { CircleUserRound } from "lucide-react";

export default function Header() {
  const pathName = usePathname();
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/posts", label: "Posts" },
    { href: "/create-post", label: "Create Post" },
  ];

  return (
    <header className="flex justify-between px-7 py-5 border-b items-center">
      <Link href={"/"}>
        <Image
          src={"https:bytegrad.com/course-assets/youtube/example-logo.png"}
          alt="Logo"
          width={35}
          height={35}
        />
      </Link>
      <nav>
        <ul className="flex gap-3 items-center">
          {navLinks.map((link) => (
            <li
              key={link.href}
              className={`${
                pathName === link.href ? "text-zinc-900" : "text-zinc-400"
              } hover:text-zinc-900 transition-colors text-lg`}
            >
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
