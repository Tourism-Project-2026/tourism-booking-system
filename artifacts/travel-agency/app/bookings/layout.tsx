import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";

export default async function BookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const isAdmin = token ? await verifySession(token) : false;

  if (!isAdmin) {
    redirect("/login?from=/bookings");
  }

  return <>{children}</>;
}
