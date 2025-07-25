// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { auth } from "./auth";

// export async function middleware(request: NextRequest) {
//   const session = await auth();

//   const protectedPaths = ["/", "/profile"];
//   const isProtected = protectedPaths.some((path) =>
//     request.nextUrl.pathname.startsWith(path)
//   );

//   if (isProtected && !session) {
//     return NextResponse.redirect(new URL("/signin", request.url));
//   }

//   return NextResponse.next();
// }

// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth";

export async function middleware(request: NextRequest) {
  const session = await auth();

  const protectedPaths = ["/", "/profile", "/chat"];
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}
