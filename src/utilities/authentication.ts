import jwt from 'jsonwebtoken'
import env from '../config/environments'

export const  auth = (req: any, res: any, next: any) => {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401) // if there isn't any token
  
    jwt.verify(token, env.appSecret, (err: any, user: any) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        console.log(user)
        req.user = user
        next() // pass the execution off to whatever request the client intended
    })
}