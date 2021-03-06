import { Request, Response } from 'express'
import { Document } from 'mongoose'
import Restaurant, { IPoint } from '../models/restaurant.model'
import Recommenation, { IHistory } from '../models/recommendation.model'
import mongoose from 'mongoose'
import { historyService, recommendationService, restaurantService } from '../services'
import { successResponse, errorResponse } from '../utilities/controller'

export interface InitialRequest {
    users: string[]
    location: IPoint
    is_group: boolean
    type: string
}

export interface UpdateRequest {
    token: string
    histories: IHistory[]
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
    initialize: (req: Request, res: Response): void => {
        console.log('init group')
        recommendationService.initialize(req.body.members, req.body.location, req.body.is_group, req.body.type).then((recommendation) => {
            res.json(successResponse(recommendation))
        }).catch((error) => { console.log('...'); console.log(error); res.json(errorResponse(error))})
    },

    request: (req: Request, res: Response): void => {
        const count = parseInt(req.query.count as string) ?? 6
        recommendationService.request(req.params.id, count).then((restaurants) => {
            res.json(successResponse(restaurants))
        }).catch((error) => { res.json(errorResponse(error))})
    },

    updateHistories: (req: Request, res: Response): void => {
        recommendationService.updateHistories(req.params.id, req.body.histories).then((_) => {
            res.json(successResponse(null))
        }).catch((error) => { res.json(errorResponse(error))})
    },

    updateRating: (req: Request, res: Response): void => {
        recommendationService.updateRating(req.params.id, req.params.userid, req.body.rating).then((_) => {
            res.json(successResponse(null))
        }).catch((error) => { res.json(errorResponse(error))})
    },

    complete: (req: Request, res: Response): void => {
        recommendationService.complete(req.params.id).then((_) => {
            res.json(successResponse(null))
        }).catch((error) => { res.json(errorResponse(error))})
    },

    getFinal: (req: Request, res: Response): void => {
        recommendationService.getFinal(req.params.id).then((restaurant) => {
            res.json(successResponse(restaurant))
        }).catch((error) => { res.json(errorResponse(error))})
    },

    joinGroup: (req: Request, res: Response): void => {
        recommendationService.joinGroup(req.params.pin, req.body.member).then((recommendation) => {
            res.json(successResponse(recommendation))
        }).catch((error) => { res.json(errorResponse(error))})
    },

    getById: (req: Request, res: Response): void => {
        recommendationService.getById(req.params.id).then((recommendation) => {
            res.json(successResponse(recommendation))
        }).catch((error) => { res.json(errorResponse(error))})
    },

    update: (req: Request, res: Response): void => {
        recommendationService.update(req.params.id, req.body.recommendation).then((recommendation) => {
            res.json(successResponse(recommendation))
        }).catch((error) => { res.json(errorResponse(error))})
    },

    updateMemberPreferPrice: (req: Request, res: Response): void => {
        recommendationService.updateMemberPreferPrice(req.params.id, req.params.userid, req.body.prefer_price).then((_) => {
            res.json(successResponse(null))
        }).catch((error) => { res.json(errorResponse(error))})
    },

    updateMemberRestaurantRank: (req: Request, res: Response): void => {
        recommendationService.updateMemberRestaurantRank(req.params.id, req.params.userid, req.body.rank).then((recommendation) => {
            res.json(successResponse(recommendation))
        }).catch((error) => { res.json(errorResponse(error))})
    },
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
        recommendationService.initializeRecommendationDeprecated(req.body).then((result) => {
            res.json(result)
        }).catch((error) => {
            res.status(500).send(error)
        })
    },

    requestRecommendation: (req: Request, res: Response): void => {
        recommendationService.updateRecommendation(req.body).then((recommendation) => {
            // recommendation.populate(([{
            //     path: 'histories.restaurant',
            //     model: 'restaurants',
            //     populate: {
            //         path: 'profile.categories',
            //         model: 'categories'
            //     }
            // }, {
            //     path: 'users',
            //     model: 'users',
            //     populate: {
            //         path: 'profile.preference.categories.category',
            //         model: 'categories',
            //     }
            // }])).execPopulate().then((r) => console.log(r))
            recommendationService.populate(recommendation).then((recommendation) => {
                recommendationService.getRecommendation(recommendation.toObject()).then((restaurants) => {
                    // console.log(restaurants)
                    res.json({
                        token: recommendation.toObject()._id,
                        recommendations: restaurants,
                    })
                }).catch((error) => {
                    throw(error)
                })
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

    // getById: (req: Request, res: Response): void => {
    //     recommendationService.getById(req.params.id).then((result) => {
    //         res.json(result)
    //     }).catch((error) => {
    //         res.status(500).send(error)
    //     })
    // },

    getDetailedRestaurantById: (req: Request, res: Response): void => {
        recommendationService.getByIdWithUserHistory(req.params.id).then((result) => {
            res.json(result)
        }).catch((error) => {
            res.status(500).send(error)
        })
    },

    getHistory: (req: Request, res: Response): void => {
        const userIds = req.body.user_ids
        const restaurantIds = req.body.restaurant_ids
        historyService.getUserHistories(restaurantIds, userIds).then((result) => {
            res.json(result)
        }).catch((error) => { res.status(500).send(error) })
    }
}
