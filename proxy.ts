import { updateSession } from "@/lib/supabase/proxy";
import { type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Only this route reads an existing authenticated session on the server.
  // Client-side account pages refresh their session through AccountProvider.
  matcher: ["/protected/:path*"],
};
