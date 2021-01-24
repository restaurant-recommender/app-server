import { Request, Response } from 'express'
import { Document } from 'mongoose'
import { categoryService } from '../services'
import Category from '../models/category.model'
import { errorResponse, successResponse } from '../utilities/controller'

export const categoryController = {
    getCommonCategories: (req: Request, res: Response): void => {
        categoryService.getCommonCetegories(req.query.lang as string).then((categories) => {
            res.json(successResponse(categories))
        }).catch((error) => { res.json(errorResponse(error)) })
    },

    // ------------------------------------------


    update: (req: Request, res: Response): void => {
        Category.findOneAndUpdate({ _id: req.params.id, is_active: true }, req.body, (err: any, category: Document) => {
            if (err) {
                res.send(err)
            }
            res.json(category)
        })
    },

    searchCategories: (req: Request, res: Response): void => {
        Category.find({ is_active: true, ...req.query }, (err: any, user: Document) => {
            if (err) {
                res.send(err)
            }
            res.json(user)
        })
    },

    getAllCategories: (req: Request, res: Response): void => {
        Category.find({ is_active: true }, (err: any, user: Document) => {
            if (err) {
                res.send(err)
            }
            res.json(user)
        })
    },

    createCategory: (req: Request, res: Response): void => {
        const category = new Category(req.body)
    
        category.save((err: any, user: Document) => {
            if (err) {
                res.send(err)
            }
            res.json(user)
        })
    }
}
