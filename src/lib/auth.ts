import CognitoProvider from "next-auth/providers/cognito";
import { NextAuthOptions } from "next-auth";

const SECRET_KEY = process.env.SECRET_KEY;

export const authOptions: NextAuthOptions = {
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID || "",
      clientSecret:
        process.env.COGNITO_CLIENT_SECRET ||
        "",
      issuer: process.env.COGNITO_ISSUER,
      authorization: { params: { scope: "openid email phone" } },
    })
  ],
session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (profile && typeof profile === "object" && "cognito:username" in profile) {
        // @ts-ignore: Property 'cognito:username' comes from Cognito profile
        token.name = profile["cognito:username"];
      }
      return token;
    },
    async session({ session, token }) {
      // opcional: expón el accessToken al cliente
      // @ts-ignore
    
      session.accessToken = token.accessToken;
      if (session.user) {
        session.user.name = token.name || session.user.name;
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      // siempre que inicien sesión, mándalos a /feed
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return `${baseUrl}/feed`;
    },
  },
  pages: {
     signIn: "/",
  },

};
