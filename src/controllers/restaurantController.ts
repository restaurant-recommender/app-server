import { Request, Response } from "express"
import { Document } from "mongoose"
import Restaurant from "../models/restaurantModel"

export const getAllRestaurant = (req: Request, res: Response): void => {
    Restaurant.find({ is_active: true }, (err: any, user: Document) => {
        if (err) {
            res.send(err)
        }
        res.json(user)
    })
}

export const createRestaurant = (req: Request, res: Response): void => {
    const restaurnat = new Restaurant(req.body)

    restaurnat.save((err: any, user: Document) => {
        if (err) {
            res.send(err)
        }
        res.json(user)
    })
}