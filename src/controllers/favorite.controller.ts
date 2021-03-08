import { json, Request, Response } from 'express'
import { Document } from 'mongoose'
import { categoryService } from '../services'
import Favorite from '../models/favorite.model'
import { errorResponse, successResponse } from '../utilities/controller'
import { favoriteService } from '../services/favorite.service'

export const favoriteController = {

    getAll: (req: Request, res: Response): void => {
        Favorite
            .find({})
            .populate([{
                    path: 'user',
                    model: 'users',
                }, {
                    path: 'restaurants',
                    model: 'restaurants',
                    populate: {
                        path: 'profile.categories',
                        model: 'categories'
                    }
                }])
            .then(data => {
                res.json(data)
            })           
    },

    create: (req: Request, res: Response): void => {
        const favorite = new Favorite(req.body)
    
        favorite.save((err: any, user: Document) => {
            if (err) {
                res.send(err)
            }
            res.json(user)
        })
    },

    getUserFavorite:  (req: Request, res: Response): void => {
        favoriteService.getFavoriteRestaurantsByUserId(req.params.userid as string).then((restaurants) => {
            res.json(successResponse(restaurants))
        }).catch(err => { res.json(errorResponse(err)) })
    },

    addUserFavorite:  (req: Request, res: Response): void => {
        favoriteService.addFaveoriteRestaurant(req.params.userid as string, req.params.restaurantid as string).then(_ => {
            res.json(successResponse(null))
        }).catch(err => { res.json(errorResponse(err)) })
    },

    removeUserFavorite:  (req: Request, res: Response): void => {
        favoriteService.removeFaveoriteRestaurant(req.params.userid as string, req.params.restaurantid as string).then(_ => {
            res.json(successResponse(null))
        }).catch(err => { res.json(errorResponse(err)) })
    },
}
