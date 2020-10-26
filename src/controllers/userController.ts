import { Request, Response } from 'express'
import { Document } from 'mongoose'
import User from '../models/userModel'
import mongoose from 'mongoose'

export const userController = {
    hasUsername: (req: Request, res: Response): void => {
        User.findOne({ username: req.params.username }, (err: any, user: Document) => {
            if (err) {
                res.send(err)
            }
            if (user) {
                res.send(true)
            } else {
                res.send(false)
            }
        })
    },

    getUser: (req: Request, res: Response): void => {
        User.findById(req.params.id, (err: any, user: Document) => {
            if (err) {
                res.send(err)
            }
            res.json(user)
        })
    },

    getAllUsers: (req: Request, res: Response): void => {
        User.find({ is_active: true }, (err: any, user: Document) => {
            if (err) {
                res.send(err)
            }
            res.json(user)
        })
    },

    createUser: (req: Request, res: Response): void => {
        let categoryIds: [any?] = []
        req.body.profile.preference.categories.forEach((e: string) => {
            categoryIds.push(mongoose.Types.ObjectId(e))
        })
        req.body.profile.preference.categories = categoryIds
    
        const user = new User(req.body)
    
        user.save((err: any, user: Document) => {
            if (err) {
                res.send(err)
            }
            res.json(user)
        })
    }
}
