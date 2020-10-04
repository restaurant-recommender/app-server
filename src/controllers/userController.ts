import { Request, Response } from "express"
import { Document } from "mongoose"
import User from "../models/userModel"

export const getUser = (req: Request, res: Response): void => {
    User.findById(req.params.id, (err: any, user: Document) => {
        if (err) {
            res.send(err)
        }
        res.json(user)
    })
}

export const getAllUser = (req: Request, res: Response): void => {
    User.find({ is_active: true }, (err: any, user: Document) => {
        if (err) {
            res.send(err)
        }
        res.json(user)
    })
}

export const createUser = (req: Request, res: Response): void => {
    const user = new User(req.body)

    user.save((err: any, user: Document) => {
        if (err) {
            res.send(err)
        }
        res.json(user)
    })
}

export const interact = (req: Request, res: Response): void => {
    const userId = req.params.id
    const restaurantId = req.body.restaurant_id
    const isLove = req.body.is_love
    const rating = req.body.rating ?? null

    const newBehavior = {
        restaurant_id: restaurantId,
        is_love: isLove,
        rating: rating,
        interact_date: Date.now(),
    }

    User.findOneAndUpdate({
        _id: userId
    }, { 
        $push: { behavior: newBehavior } 
    }, (err) => {
        if (err) {
            res.status(500).send()
        }
        res.status(200).send()
    })
}