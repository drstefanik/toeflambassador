import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { env } from "./config";

export type StudentPayload = {
  role: "student";
  studentId: string;
  email: string;
};

export type CenterPayload = {
  role: "center";
  centerUserId: string;
  centerId: string;
  email: string;
};

export type TokenPayload = StudentPayload | CenterPayload;

const STUDENT_COOKIE = "student_token";
const CENTER_COOKIE = "center_token";

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string) {
  if (!hash) return false;
  return bcrypt.compare(plain, hash);
}

export function signToken(payload: TokenPayload) {
  if (!env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET");
  }
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  if (!env.JWT_SECRET) return null;
  try {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function setAuthCookie(
  res: NextResponse,
  token: string,
  type: "student" | "center"
) {
  const cookieName = type === "student" ? STUDENT_COOKIE : CENTER_COOKIE;
  res.cookies.set(cookieName, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  const otherCookie = type === "student" ? CENTER_COOKIE : STUDENT_COOKIE;
  res.cookies.delete(otherCookie);
}

export function clearAuthCookies(res: NextResponse) {
  res.cookies.delete(STUDENT_COOKIE);
  res.cookies.delete(CENTER_COOKIE);
}

export function getUserFromRequest(req?: NextRequest) {
  const cookieStore = req ? req.cookies : cookies();
  const studentToken = cookieStore.get(STUDENT_COOKIE)?.value;
  const centerToken = cookieStore.get(CENTER_COOKIE)?.value;

  if (studentToken) {
    const payload = verifyToken(studentToken);
    if (payload && payload.role === "student") {
      return payload;
    }
  }

  if (centerToken) {
    const payload = verifyToken(centerToken);
    if (payload && payload.role === "center") {
      return payload;
    }
  }

  return null;
}
