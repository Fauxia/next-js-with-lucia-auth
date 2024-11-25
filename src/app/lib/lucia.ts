import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { prisma } from "./prisma";
import { cookies } from "next/headers";
import { cache } from "react";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "lucia-auth-token",
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

export const getUser = cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value || null;
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }
  const { user, session } = await lucia.validateSession(sessionId);
  console.log("User is ", session);
  try {
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch (error) {}

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user?.id,
    },
    select: {
      name: true,
      email: true,
    },
  });
  return {
    user: dbUser,
    session,
  };
});
