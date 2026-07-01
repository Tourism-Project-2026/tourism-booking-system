import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "tp_session";

function getSecret(): Uint8Array {
  return new TextEncoder().encode(
    process.env.SESSION_SECRET ?? "dev-secret-please-change-in-production"
  );
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySession(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export function checkCredentials(username: string, password: string): boolean {
  const validUser = process.env.ADMIN_USERNAME ?? "admin";
  const validPass = process.env.ADMIN_PASSWORD ?? "admin123";
  return username === validUser && password === validPass;
}
