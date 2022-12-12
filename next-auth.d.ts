// import "next-auth/jwt"
import NextAuth, {DefaultSession} from "next-auth"

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module "next-auth/jwt" {
    interface JWT {
        /** The user's role. */
        userRole?: "admin",
        user: DefaultSession["user"],
    }
    /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
    interface Session {
        // session: DefaultSession["session"],
        session: {
            sessionToken: string
        } & DefaultSession["session"],
        user: {
            /** The user's postal address. */
            role: string
            login: string
        } & DefaultSession["user"],
    }
    interface User {
        role: string
        login: string
    }
}
