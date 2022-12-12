import NextAuth, {NextAuthOptions} from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import GithubProvider from "next-auth/providers/github"
import TwitterProvider from "next-auth/providers/twitter"
import Auth0Provider from "next-auth/providers/auth0"
// import AppleProvider from "next-auth/providers/apple"
// import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials"
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
            authorization: {params: {scope: 'read:user user:email'}},

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
        // the Credentials provider can only be used if JSON Web Tokens are enabled for sessions
        // https://next-auth.js.org/providers/credentials
        CredentialsProvider({
            id: "domain-login",
            name: "Domain Account",
            async authorize(credentials, req) {
                console.log("[authorize] credentials:", credentials)
                const user = {
                    /* add function to get user */
                    id: "1",
                    name: 'vincent',
                    email: 'venjiang@readfog.com',
                    image: 'https://avatars.githubusercontent.com/u/96467908?v=4',
                    role: 'member',
                    login: 'venjiangr',
                }
                return user
            },
            credentials: {
                // domain: {
                //     label: "Domain",
                //     type: "text ",
                //     placeholder: "CORPNET",
                //     value: "CORPNET",
                // },
                username: {label: "Username", type: "text ", placeholder: "jsmith"},
                password: {label: "Password", type: "password"},
            },
        }),
    ],
    theme: {
        colorScheme: "light",
    },
    callbacks: {
        jwt({token, account, user}) { // use jwt to store user info
            // Persist the OAuth access_token to the token right after signin
            token.userRole = "admin"
            if (account) {
                // token.accessToken = account.access_token
                console.log("[jwt] account:", account)
            }

            console.log("[jwt] token:", token)
            user && (token.user = user)
            console.log("[jwt] user:", token.user)

            return token
        },
        session({session, token, user}) { // use database to store user info
            // Send properties to the client, like an access_token from a provider.
            // session.accessToken = token.accessToken
            console.log("[session] session:", session)
            console.log("[session] token:", token)
            console.log("[session] user:", user)
            // 1. use jwt to store user info
            // session.user = token.user
            // session.user.role = token.userRole
            // session.user.displayName = token.user.displayName
            //
            // 2. use credentials to store user info
            if (token) {
                session.user = token.user
            }
            // 3. use database to store user info
            if (user) {
                session.user.login = user.login
                session.user.role = user.role
            }
            return session
        },
        signIn({user, account, profile}) {
            // user.role = "team"
            // user profile login 
            if (profile?.login) {
                user.login = profile.login
            }
            console.log("[signIn] user:", user)
            console.log("[singIn] account:", account)
            console.log("[singIn] profile:", profile)
            return true
        },
    },
    session: {
        strategy: "jwt", // use jwt to store user info
    },
    secret: "abc",
}

export default NextAuth(authOptions)
