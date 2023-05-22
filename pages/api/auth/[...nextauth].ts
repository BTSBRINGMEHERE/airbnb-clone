import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // 깃허브
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    // 구글
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // 사용자 계정
    CredentialsProvider({
      // 인증 정보
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        // 인증 정보에 대한 이메일과 비밀번호가 없을시
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid Credentials");
        }

        // schema.prisma에서 user의 유니크한 db(email)를 가져옴
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        // 해당 유저나 유저의 해쉬비밀번호가 없을시
        if (!user || !user?.hashedPassword) {
          throw new Error("Invalid Credentials");
        }

        // 비크립을 통해 인증정보의 비밀번호와 해쉬비밀번호를 비교
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        // 비크립을 통해 불일치시
        if (!isCorrectPassword) {
          throw new Error("Invalid Credentials");
        }

        // 최종적으로 인증정보, 유니크한 이메일, 비밀번호와 해쉬비밀번호가 동일한 user를 return
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
