import { Request, Response } from 'express'
import { Document } from 'mongoose'
import { userService } from '../services'
import User, { IUser } from '../models/user.model'
import mongoose from 'mongoose'
import { errorResponse, successResponse } from '../utilities/controller'

export const userController = {
    updatePreferences: (req: Request, res: Response): void => {
        userService.updatePreferences(req.params.id, req.body).then((result) => {
            if (result) {
                res.json(successResponse(null))
            }
        }).catch((error) => { throw(error) })
    },

    getPreferences: (req: Request, res: Response): void => {
        userService.getPreferences(req.params.id).then((preferences) => {
            res.json(successResponse(preferences))
        }).catch((error) => { res.json(errorResponse(error)) })
    },
    
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
