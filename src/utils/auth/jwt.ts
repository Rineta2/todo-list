import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface JWTPayload {
  userId: string;
  email: string;
}

export async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    throw new Error("Invalid token");
  }
}

export async function getCurrentUser(): Promise<JWTPayload | null> {
  const token = await getToken();
  if (!token) return null;

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}
