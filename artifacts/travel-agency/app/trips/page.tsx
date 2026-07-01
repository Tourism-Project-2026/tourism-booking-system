import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";
import { TripsClient } from "@/components/TripsClient";

export default async function TripsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const isAdmin = token ? await verifySession(token) : false;

  return <TripsClient isAdmin={isAdmin} />;
}
