import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

export default clerkMiddleware((auth, req)=> {
  if(protectRoutes(req)) auth().protect()
});

const protectRoutes = createRouteMatcher([
  "/", 
  "upcoming",
  "previous",
  "recording",
  "meeting(.*)"
]);



export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};