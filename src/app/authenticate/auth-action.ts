"use server";

import { getUser, lucia } from "@/app/lib/lucia";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { sendEmail } from "../lib/email";

interface User {
  name: string;
  email: string;
  password: string;
}

export default async function signUpAction(user: User) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });
    if (existingUser) {
      return { error: "Email already exists", success: false };
    }

    const hashedPassword = user.password
      ? await bcrypt.hash(user.password, 10)
      : null;
    const newUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch (error) {
    return { error: "An unexpected error occurred", success: false };
  }
}

type UserProp = {
  email: string;
  password: string;
};
export async function SigninAction(user: UserProp) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });
    if (!existingUser || !existingUser.password) {
      // Either the user doesn't exist or their password is null
      return { error: "Invalid Credentials", success: false };
    }
    if (!existingUser.emailVerified) {
      return { error: "Email not verified", success: false };
    }
    const isMatched = await bcrypt.compare(
      user.password,
      existingUser.password
    );
    if (!isMatched) {
      return { error: "Invalid Credentials", success: false };
    }
    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = await lucia.createSessionCookie(session.id);
    //cookie
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return { success: true };
  } catch (error) {
    return { error: "An unexpected error occured", success: false };
  }
}

export const logoutUser = async () => {
  try {
    const { session } = await getUser();
    if (!session) {
      return { error: "Unauthorized", success: true };
    }
    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return { success: true };
    // redirect("/authenticate");
  } catch (error) {
    return { error: "Unauthorized", success: true };
  }
};

export const resendEmaill = async (email: string) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!existingUser) {
    return { error: "User not found", success: false };
  }
  if (existingUser.emailVerified) {
    return { error: "User already verified", success: false };
  }
  const sign = { id: existingUser.id, email: existingUser.email };
  const signToken = jwt.sign(sign, "sghwgdhg");

  const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email/${signToken}`;
  await sendEmail({
    html: `<a href="${verificationLink}">Verify your email</a>`,
    subject: "Verify your eamil",
    to: email,
  });
  console.log(verificationLink);
  return { success: true };
};

type Verify = (
  token: string
) => Promise<
  "userNotExists" | "alreadyVerified" | "userVerified" | "somethingWrong"
>;

export const verifyEmail: Verify = async (token) => {
  try {
    const decodedToken = jwt.verify(token, "sghwgdhg") as {
      id: string;
      email: string;
    };
    const userId = decodedToken.id;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) return "userNotExists";
    if (user.emailVerified) return "alreadyVerified";
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        emailVerified: true,
      },
    });
    return "userVerified";
  } catch (error) {
    console.log(error);
    return "somethingWrong";
  }
};
