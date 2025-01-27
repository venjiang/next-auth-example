// This is an example of how to read a JSON Web Token from an API route
// import { getToken } from "next-auth/jwt"
import jwt from "jsonwebtoken"

import type {NextApiRequest, NextApiResponse} from "next"

const secret = process.env.NEXTAUTH_SECRET

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // const token = await getToken({ req, secret })
    // res.send(JSON.stringify(token, null, 2))
    const session_token = req.cookies["next-auth.session-token"]
    console.log("session_token:", session_token)
    const token = jwt.sign({session: session_token}, secret)
    console.log("jwt:", token)
    res.send(token)
}
