import NextAuth, {NextAuthOptions} from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import GithubProvider from "next-auth/providers/github"
import TwitterProvider from "next-auth/providers/twitter"
import Auth0Provider from "next-auth/providers/auth0"
// import AppleProvider from "next-auth/providers/apple"
// import EmailProvider from "next-auth/providers/email"
import {PrismaAdapter} from "@next-auth/prisma-adapter"
import {PrismaClient} from '@prisma/client'
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()
// prisma.user.findOne({where: {id: 1}}).then(user => console.log(user))
// prisma.user.findUnique()
const adapter = PrismaAdapter(prisma)
// adapter.getUserByAccount
// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
    // jwt overrides
    // https://next-auth.js.org/configuration/nextjs#custom-jwt-decode-method

    // jwt: {
    //     async encode({secret, token}) {
    //         return jwt.sign(token, secret)
    //     },
    //     async decode({secret, token}) {
    //         return jwt.verify(token, secret)
    //     },
    // },
    // https://next-auth.js.org/adapters/prisma
    adapter: PrismaAdapter(prisma),
    // https://next-auth.js.org/configuration/providers/oauth
    providers: [
        /* EmailProvider({
             server: process.env.EMAIL_SERVER,
             from: process.env.EMAIL_FROM,
           }),
        // Temporarily removing the Apple provider from the demo site as the
        // callback URL for it needs updating due to Vercel changing domains
    
        Providers.Apple({
          clientId: process.env.APPLE_ID,
          clientSecret: {
            appleId: process.env.APPLE_ID,
            teamId: process.env.APPLE_TEAM_ID,
            privateKey: process.env.APPLE_PRIVATE_KEY,
            keyId: process.env.APPLE_KEY_ID,
          },
        }),
        */
        FacebookProvider({
            clientId: process.env.FACEBOOK_ID,
            clientSecret: process.env.FACEBOOK_SECRET,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,

        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        TwitterProvider({
            clientId: process.env.TWITTER_ID,
            clientSecret: process.env.TWITTER_SECRET,
        }),
        Auth0Provider({
            clientId: process.env.AUTH0_ID,
            clientSecret: process.env.AUTH0_SECRET,
            issuer: process.env.AUTH0_ISSUER,
        }),
    ],
    theme: {
        colorScheme: "light",
    },
    callbacks: {
        jwt({token, account, user}) {
            token.userRole = "admin"
            if (account) {
                token.accessToken = account.access_token
                console.log("[jwt] account:", account)
            }

            console.log("[jwt] token:", token)
            user && (token.user = user)
            console.log("[jwt] user:", user)
            return token
        },
        session({session, token, user}) {
            // session.accessToken = token.accessToken
            console.log("[session] session:", session)
            console.log("[session] token:", token)
            console.log("[session] user:", user)
            // user.role = token.userRole
            // session.user.role = user.role
            return session
        },
        signIn({user}) {
            user.role = "team"
            console.log("user:", user)
            return true
        },
    },
    // session: {
    // strategy: "jwt",
    // },
    secret: "lzq",
}

export default NextAuth(authOptions)
