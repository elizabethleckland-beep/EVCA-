
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
// @ts-ignore - PrismaClient generation may be pending in the environment
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // @ts-ignore
      session.user.role = user.role;
      // @ts-ignore
      session.user.orgId = user.orgId;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
