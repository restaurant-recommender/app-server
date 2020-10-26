import { Request, Response } from 'express'
import env from '../config/environments'
import User from '../models/userModel'
import jwt from 'jsonwebtoken'

// function authenticateToken(req, res, next) {
//     // Gather the jwt access token from the request header
//     const authHeader = req.headers['authorization']
//     const token = authHeader && authHeader.split(' ')[1]
//     if (token == null) return res.sendStatus(401) // if there isn't any token
  
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
//       console.log(err)
//       if (err) return res.sendStatus(403)
//       req.user = user
//       next() // pass the execution off to whatever request the client intended
//     })
//   }

const generateToken = (username: String): String => {
    return jwt.sign(username, env.appSecret)
}

export const authenticationController = {
    login: async (req: Request, res: Response) => {
        let username = ''
        if ('username' in req.body) {
            username = req.body.username
        } else {
            res.status(300).send('Invalid body')
        }
        try {
            const user = await User.findOne({ username: username })
            if (!user) {
                res.json({
                    status: false,
                    error: 'Invalid username.',
                })
            }

            res.json({
                status: true,
                token: generateToken(username),
                data: user,
            })
        } catch (err) {
            res.status(500).send(err)
        }
    }
}