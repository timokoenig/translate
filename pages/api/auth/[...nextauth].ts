import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

const GITHUB_ID = process.env.GITHUB_ID
if (!GITHUB_ID) throw new Error('Env GITHUB_ID not set')

const GITHUB_SECRET = process.env.GITHUB_SECRET
if (!GITHUB_SECRET) throw new Error('Env GITHUB_SECRET not set')

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
      authorization: {
        params: {
          scope: 'read:user repo',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }: any) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }: any) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken
      return session
    },
  },
  pages: {
    signIn: '/signin',
  },
}

export default NextAuth(authOptions)
