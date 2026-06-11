import { NextRequest, NextResponse } from "next/server";
import { errorWrapper } from "./utils/errorWrapper";
import { Api } from "./lib/api";

export async function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  const currentPath = request.nextUrl.pathname;

  if (currentPath === "/auth/login" || currentPath === "/admin/login") {
    return NextResponse.next({ headers });
  }

  const token = request.cookies.get("token")?.value;

  // 2. Routing logic for /admin paths
  if (currentPath.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const [error] = await errorWrapper(async () => {
      const res = await Api.get("/auth/validate/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    });

    if (error) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next({ headers });
  }

  // 3. Routing logic for standard user paths
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const [error] = await errorWrapper(async () => {
    const res = await Api.get("/auth/validate", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  });

  if (error) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next({ headers });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
