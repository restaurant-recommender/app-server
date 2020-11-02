import { Request, Response } from 'express'
import env from '../config/environments'
import User from '../models/user.model'
import jwt from 'jsonwebtoken'

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