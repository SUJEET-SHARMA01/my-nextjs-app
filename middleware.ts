import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRouter = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/",
  "/home",
]);

const isPublicApiRouter = createRouteMatcher(["/api/videos"]);

export default clerkMiddleware((auth, req) => {
  const { userId } = auth();
  const currentUrl = new URL(req.url);
  const isCurrentDashbord = currentUrl.pathname === "/home";
  const ApiRequest = currentUrl.pathname.startsWith("/api");

  if (userId && isPublicRouter(req) && !isCurrentDashbord) {
    return NextResponse.redirect(new URL("/home", req.url));
  }
  //not login
  if (!userId) {
    if (!isPublicRouter && !isPublicApiRouter) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    if (ApiRequest && !isPublicApiRouter(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }
  return NextResponse.next();
});


export const config = {
  matcher: [
    
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
   
    "/(api|trpc)(.*)",
  ],
};
