import { Request, Response } from "express"
import { Document } from "mongoose"
import Category from "../models/categoryModel"

export const categoryController = {
    update: (req: Request, res: Response): void => {
        Category.findOneAndUpdate({ _id: req.params.id, is_active: true }, req.body, (err: any, category: Document) => {
            if (err) {
                res.send(err)
            }
            res.json(category)
        })
    }
}

export const searchCategories = (req: Request, res: Response): void => {
    Category.find({ is_active: true, ...req.query }, (err: any, user: Document) => {
        if (err) {
            res.send(err)
        }
        res.json(user)
    })
}

export const getAllCategories = (req: Request, res: Response): void => {
    Category.find({ is_active: true }, (err: any, user: Document) => {
        if (err) {
            res.send(err)
        }
        res.json(user)
    })
}

export const createCategory = (req: Request, res: Response): void => {
    const category = new Category(req.body)

    category.save((err: any, user: Document) => {
        if (err) {
            res.send(err)
        }
        res.json(user)
    })
}