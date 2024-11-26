"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { logoutUser } from "@/app/authenticate/auth-action";
import { useSession } from "@/providers/SessionProvider";
import { toast } from "sonner";

export default function Header() {
  const { user } = useSession();
  const pathName = usePathname();
  const router = useRouter();
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/posts", label: "Posts" },
    { href: "/create-post", label: "Create Post" },
  ];

  const logOut = async () => {
    const res = await logoutUser();
    if (res.success) {
      return router.push("/authenticate");
    } else {
      toast.error(res.error);
    }
  };

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
      <nav className="flex flex-col md:flex-row">
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
        {user ? (
          <form action={logOut}>
            <Button type="submit">Log out</Button>
          </form>
        ) : (
          <Link href={"/authenticate"}>
            <Button>Sign in</Button>
          </Link>
        )}
      </nav>
    </header>
  );
}
