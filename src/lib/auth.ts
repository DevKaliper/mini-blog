import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

const SECRET_KEY = process.env.SECRET_KEY;

const loginUser = async (username: string, password: string, email: string) => {
  const INTERNAL_BACKEND_URL = process.env.INTERNAL_BACKEND_URL;
  const response = await fetch(`${INTERNAL_BACKEND_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email }),
  });

  if (response.status !== 200) return null;
  return response.json();
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { username: {}, password: {} },
      async authorize(credentials) {
        const { username, password } = credentials as any;
        try {
          const response = await loginUser(username, password, "");
          if (response?.user) {
            return {
              id: response.user.id,
              name: response.user.username,
              email: response.user.email,
            };
          }
          console.error("Invalid credentials");
          return null;
        } catch (error) {
          console.error("Error logging in:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: SECRET_KEY,
};
