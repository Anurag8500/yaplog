import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"

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

          const existingUser = await db
            .collection("users")
            .findOne({ email: credentials.email })

          if (existingUser) return null

          const hashedPassword = await bcrypt.hash(credentials.password as string, 12)

          const result = await db.collection("users").insertOne({
            name: credentials.name,
            email: credentials.email,
            password: hashedPassword,
            createdAt: new Date(),
          })

          return {
            id: result.insertedId.toString(),
            name: credentials.name as string,
            email: credentials.email as string,
          }
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
