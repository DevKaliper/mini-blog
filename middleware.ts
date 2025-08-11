// middleware.ts en la raíz del proyecto
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/feed"],
};
