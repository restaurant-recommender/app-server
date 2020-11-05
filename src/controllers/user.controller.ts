import { Request, Response } from 'express'
import { Document } from 'mongoose'
import { userService } from '../services'
import User from '../models/user.model'
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

    create: (req: Request, res: Response): void => {
        userService.create(req.body).then((user) => {
            res.json(user)
        }).catch((error) => {
            res.status(500).send(error)
        })
    },

    update: (req: Request, res: Response): void => {
        userService.update(req.params.id, req.body).then((user) => {
            res.json(user)
        }).catch((error) => {
            res.status(500).send(error)
        })
    },

    updateProfileWeight: (req: Request, res: Response): void => {
        try {
            userService.updateProfileWeight(req.params.id, req.body)
            res.status(200).send('ok')
        } catch (error) {
            res.status(500).send(error)
        }
    },
}
