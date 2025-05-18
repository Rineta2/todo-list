import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/utils/db";
import Account from "@/models/Account";
import bcrypt from "bcryptjs";

interface GoogleUser {
  email: string;
  name: string;
  image?: string;
  id?: string;
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        await connectDB();
        const user = await Account.findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({
      user,
      account,
    }: {
      user: GoogleUser;
      account: { provider: string } | null;
    }) {
      if (account?.provider === "google") {
        try {
          await connectDB();

          // Check if user already exists
          const existingUser = await Account.findOne({ email: user.email });

          if (!existingUser) {
            // Create new user if doesn't exist
            const newUser = await Account.create({
              email: user.email,
              name: user.name,
              image: user.image,
              provider: "google",
            });
            // Add the user ID to the user object
            user.id = newUser._id.toString();
            console.log("Created new user with ID:", user.id);
          } else {
            // Add the existing user ID to the user object
            user.id = existingUser._id.toString();
            console.log("Found existing user with ID:", user.id);
          }

          return true;
        } catch (error) {
          console.error("Error saving Google user:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({
      token,
      user,
      account,
    }: {
      token: JWT;
      user: { id: string; email: string; name: string } | null;
      account: { provider: string } | null;
    }) {
      if (account && user) {
        token.provider = account.provider;
        token.id = user.id;
        console.log("JWT Callback - User:", user); // Debug log
        console.log("JWT Callback - Token:", token); // Debug log
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT & { id?: string; provider?: string };
    }) {
      if (session.user) {
        session.user.provider = token.provider;
        session.user.id = token.id;
        console.log("Session Callback - Token:", token); // Debug log
        console.log("Session Callback - Session:", session); // Debug log
      }
      return session;
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
  debug: true, // Enable debug mode
};
