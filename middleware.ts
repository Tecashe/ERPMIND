export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/sales/:path*",
    "/reports/:path*",
    "/inventory/:path*",
    "/crm/:path*",
    "/procurement/:path*",
    "/production/:path*",
    "/hr/:path*",
  ]
};
