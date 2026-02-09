import NextAuth, { AuthError } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth environment variables")
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null

        const client = await clientPromise
        const db = client.db()

        // LOGIN ONLY
        const user = await db
          .collection("users")
          .findOne({ email: credentials.email })

        if (!user || !user.password) return null

        // Ensure user is using credentials provider
        if (user.authProvider && user.authProvider !== "credentials") {
          // If the user signed up with Google but tries to log in with password
          // In a real app we might want to support linking, but for now strict separation
          throw new AuthError("ACCOUNT_PROVIDER_MISMATCH")
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isValid) return null

        // Check verification status
        if (user.emailVerified === false) {
          throw new AuthError("EMAIL_NOT_VERIFIED")
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

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const client = await clientPromise
          const db = client.db()
          const { email, name } = user

          if (!email) return false // Should not happen with Google

          const existingUser = await db.collection("users").findOne({ email })

          if (existingUser) {
            // User exists, update with Google info if not present
            await db.collection("users").updateOne(
              { email },
              {
                $set: {
                  googleId: account.providerAccountId,
                  authProvider: "google",
                  // Ensure email is verified since Google verified it
                  emailVerified: true,
                },
              }
            )
            // Explicitly attach user id from DB
            user.id = existingUser._id.toString()
            return true
          } else {
            // Create new user
            const newUser = await db.collection("users").insertOne({
              name: name || "User",
              email,
              googleId: account.providerAccountId,
              authProvider: "google",
              emailVerified: true,
              createdAt: new Date(),
            })
            // Explicitly attach user id from DB
            user.id = newUser.insertedId.toString()
            return true
          }
        } catch (error) {
          console.error("Google sign in error:", error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },

  pages: {
    signIn: "/login",
  },
})

