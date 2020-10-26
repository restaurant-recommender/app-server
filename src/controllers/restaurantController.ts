import { Request, Response } from "express"
import { Document } from "mongoose"
import Restaurant from "../models/restaurantModel"
import mongoose from 'mongoose'

export const getAllRestaurants = async (req: Request, res: Response): Promise<void> => {
    try {
        let restaurants = await Restaurant.find({ is_active: true }).populate({
            path: 'profile.categories',
            model: 'categories'
        }).exec()
        res.json(restaurants)
    } catch (err) {
        console.log(err)
        res.send(err)
    }
}

export const createRestaurant = (req: Request, res: Response): void => {
    let categoryIds: [any?] = []
    req.body.profile.categories.forEach((e: string) => {
        categoryIds.push(mongoose.Types.ObjectId(e))
    })
    req.body.profile.categories = categoryIds
    
    const restaurnat = new Restaurant(req.body)

    restaurnat.save((err: any, restaurants: Document) => {
        if (err) {
            res.send(err)
        }
        res.json(restaurants)
    })
}