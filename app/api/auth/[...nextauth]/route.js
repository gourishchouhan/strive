import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "demo-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "demo-client-secret",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        try {
          await dbConnect()
          
          // Check if user exists, if not create one
          let existingUser = await User.findOne({
            provider: "google",
            providerId: profile.sub
          })

          if (!existingUser) {
            existingUser = await User.create({
              email: user.email,
              name: user.name,
              image: user.image,
              provider: "google",
              providerId: profile.sub,
            })
          }

          // Update user info if needed
          if (existingUser.name !== user.name || existingUser.image !== user.image) {
            await User.findByIdAndUpdate(existingUser._id, {
              name: user.name,
              image: user.image,
            })
          }

          return true
        } catch (error) {
          console.error("Error during sign in:", error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        await dbConnect()
        const dbUser = await User.findOne({
          provider: account.provider,
          providerId: account.providerAccountId
        })
        
        if (dbUser) {
          token.userId = dbUser._id.toString()
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId
      }
      return session
    },
  },
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
