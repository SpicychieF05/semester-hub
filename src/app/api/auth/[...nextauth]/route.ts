
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // This is where you'd add your logic to look up the user from the database
        // For now, we'll use a mock user
        if (credentials?.email === "mallickchirantan@gmail.com" && credentials.password === "#Chirantan2965") {
          return { id: "1", name: "Test User", email: "mallickchirantan@gmail.com" }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
})

export { handler as GET, handler as POST }
