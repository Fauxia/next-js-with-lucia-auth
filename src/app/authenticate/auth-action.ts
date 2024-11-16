"use server";

import { lucia } from "@/lib/lucia";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

type UserOmit = Omit<User, "id">;

export default async function signUpAction(user: UserOmit) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });
    if (existingUser) return { error: "", success: false };

    const hashedPassword = user.password
      ? await bcrypt.hash(user.password, 10)
      : null;
    const newUser = await prisma.user.create({
      data: { ...user, password: hashedPassword },
    });

    const session = await lucia.createSession(newUser.id, {});
    const sessionCookie = await lucia.createSessionCookie(session.id);
    //*cookie
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return { success: true };
  } catch (error) {
    return { error: "An unexpected error occurred", success: false };
  }
}
