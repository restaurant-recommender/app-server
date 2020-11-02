import { Request, Response } from 'express'
import { Document } from 'mongoose'
import Restaurant, { pointInterface } from '../models/restaurant.model'
import Recommenation, { HistoryInterface } from '../models/recommendation.model'
import mongoose from 'mongoose'
import { recommendationService, restaurantService } from '../services'

export interface InitialRequest {
    users: string[]
    location: pointInterface
}

export interface UpdateRequest {
    token: string
    histories: HistoryInterface[]
}

export interface CompletedRequest {
    rating?: number
    completed_at: Date
}

const batchSize: Number = 20

const nearbyRecommender = async (token: string): Promise<void> => {
    return Recommenation.findById(token).then((recommendation) => {
        const coordinates = recommendation.toObject().location.coordinates
        const skip = recommendation.toObject().histories.length
        const limit = batchSize
        return Restaurant.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: coordinates
                    },
                    distanceField: 'dist.calculated',
                    spherical: true
                }
            },
            { $limit: skip + limit },
            { $skip: skip },
            { $lookup: {from: 'categories', localField: 'profile.categories', foreignField: '_id', as: 'profile.categories'} },
        ]).exec()
    })
}

const initializeRecommendation = (requestData: InitialRequest, callback: (token: String) => void): void => {
    let userIds: [any?] = []
    requestData.users.forEach((e: string) => {
        userIds.push(mongoose.Types.ObjectId(e))
    })
    requestData.users = userIds

    const recommendation = new Recommenation({
        ...requestData,
        created_at: Date.now(),
    })

    recommendation.save((err: any, recommendation: Document) => {
        if (err) {
            callback('')
        }
        callback(recommendation._id)
    })
}

const updateRecommendation = (res: Response, token: String, histories: [any]): void => {
    Recommenation.findOneAndUpdate(
        { _id: token },
        { $push: { histories: { $each: histories } } },
        { upsert: true },
        (err) => {
            if (err) {
                res.status(500).send()
            }
        }
    ).exec()
}

const completeRecommendation = (res: Response, token: String, requestData: CompletedRequest): void => {
    Recommenation.findOneAndUpdate(
        { _id: token },
        { ...requestData },
        { upsert: true },
        (err) => {
            if (err) {
                res.status(500).send()
            }
        }
    )
}

export const recommendationController = {
    // requestRecommendation: (req: Request, res: Response) => {
    //     const body = req.body
    //     if ('token' in body) {
    //         if ('histories' in body) {
    //             console.log('in update')
    //             updateRecommendation(res, body.token, body.histories)
    //         }
    //         if (req.query.completed === '1') {
    //             if (!('completed_at' in body)) {
    //                 res.status(400).send('completed_at is required for recommendation complation')
    //             }
    //             completeRecommendation(res, body.token, {
    //                 rating: 'rating' in body ? body.rating : -1,
    //                 completed_at: body.completed_at,
    //             })
    //         } else {
    //             nearbyRecommender(res, body.token)
    //         }
    //     } else {
    //         if (!('users' in body) || !('location' in body)) {
    //             res.status(400).send('User ids and location are needed for recommendation initialzation')
    //         } else {
    //             initializeRecommendation(body, (token: String) => {
    //                 if (token === '') {
    //                     res.status(500).send('There was an error during recommendation initialization')
    //                 }
    //                 nearbyRecommender(res, token)
    //             })
    //         }
    //     }
    // },

    initRecommendation: (req: Request, res: Response): void => {
        recommendationService.initializeRecommendation(req.body).then((result) => {
            res.json(result)
        }).catch((error) => {
            res.status(500).send(error)
        })
    },

    requestRecommendation: (req: Request, res: Response): void => {
        recommendationService.updateRecommendation(req.body).then((recommendation) => {
            recommendationService.getRecommendation(recommendation.toObject()).then((restaurants) => {
                console.log(restaurants)
                res.json({
                    token: recommendation.toObject()._id,
                    recommendations: restaurants,
                })
            }).catch((error) => {
                throw(error)
            })
        }).catch((error) => {
            res.status(500).send(error)
        })
    },

    getAll: (_: Request, res: Response): void => {
        Recommenation.find({ is_active: true }, (err: any, user: Document) => {
            if (err) {
                res.send(err)
            }
            res.json(user)
        })
    },

    getById: (req: Request, res: Response): void => {
        Recommenation.findById(req.params.id, (err: any, user: Document) => {
            if (err) {
                res.send(err)
            }
            res.json(user)
        })
    },

    getDetailedById: (req: Request, res: Response): void => {
        recommendationService.getByIdWithUserHistory(req.params.id).then((result) => {
            res.json(result)
        }).catch((error) => {
            res.status(500).send(error)
        })
    }
}
