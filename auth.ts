import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { sendVerificationEmail } from "@/lib/email"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isSignup: { label: "isSignup", type: "text" },
      },
      authorize: async (credentials) => {
        const client = await clientPromise
        const db = client.db()
        const isSignup = credentials?.isSignup === "true"

        if (!credentials?.email || !credentials?.password) return null

        // SIGN UP
        if (isSignup) {
          if (!credentials.name || (credentials.password as string).length < 8) return null

          // Check if user already exists
          const existingUser = await db
            .collection("users")
            .findOne({ email: credentials.email })

          if (existingUser) {
             throw new Error("UserExists")
          }

          const hashedPassword = await bcrypt.hash(credentials.password as string, 12)
          const verificationToken = crypto.randomBytes(32).toString("hex")
          const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

          await db.collection("users").insertOne({
            name: credentials.name,
            email: credentials.email,
            password: hashedPassword,
            emailVerified: false,
            verificationToken,
            verificationTokenExpires,
            createdAt: new Date(),
          })

          try {
            await sendVerificationEmail({
              email: credentials.email as string,
              name: credentials.name as string,
              token: verificationToken,
            })
          } catch (error) {
            console.error("Failed to send verification email:", error)
          }

          // Return null to prevent session creation
          return null
        }

        // LOGIN
        const user = await db
          .collection("users")
          .findOne({ email: credentials.email })

        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isValid) return null

        // Check verification status
        if (user.emailVerified === false) {
          throw new Error("EmailNotVerified")
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.sub = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
})
