import {withAuth} from "next-auth/middleware"

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth({
    callbacks: {
        authorized: ({req, token}) => {
            // /admin requires admin role, but /me only requires the user to be logged in.
            // req.nextUrl.pathname !== "/admin" || token?.userRole === "admin",
            console.log("[withAuth] token:", token)
            console.log("[withAuth] req:", req)
            // console.log("[withAuth] session-token:", req.cookies["next-auth.session-token"])
            // const result = req.nextUrl.pathname !== "/admin"
            // return result
            return token?.userRole === 'admin'
        },
    },
})

// export const config = {matcher: ["/admin", "/me"]}
export const config = {matcher: ["/admin"]}
