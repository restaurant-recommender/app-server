import Recommendation, { IRecommendation } from '../models/recommendation.model'
import Restaurant from '../models/restaurant.model'
import User from '../models/user.model'
import { InitialRequest, UpdateRequest } from '../controllers/recommendation.controller'
import mongoose, { Document } from 'mongoose'
import axios from 'axios'
import env from '../config/environments'
import { restaurantService } from './restaurant.service'

export const recommendationService = {
    initializeRecommendation: async (initialRequest: InitialRequest): Promise<void | Document> => {
        if (env.nearbyFetchEnabled) {
            console.log('Fecting nearby restaurants from Google')
            restaurantService.fetchNearby(initialRequest.location.coordinates[1], initialRequest.location.coordinates[0])
        }

        let userIds: [any?] = []
        initialRequest.users.forEach((userId: string) => {
            userIds.push(mongoose.Types.ObjectId(userId))
        })
        initialRequest.users = userIds
    
        const recommendation = new Recommendation({
            ...initialRequest,
            created_at: Date.now(),
        })

        return recommendation.save().then((result) => {
            const recommendation: IRecommendation = result.toObject()
            recommendation.users.forEach((userId: any) => {
                User.findByIdAndUpdate(userId,
                    { $push: { recommendation_histories: mongoose.Types.ObjectId(recommendation._id) }}
                ).exec()
            })
            return result
        })
    },

    getRecommendation: async (recommendation: IRecommendation): Promise<void | Document[]>  => {
        return axios.post(`${env.recommenderURL}/recommend/simple`, recommendation).then((result) => {
            if (result.data.status) {
                const ids: object[] = result.data.restaurant_ids.map((id: any) => mongoose.Types.ObjectId(id))
                return Restaurant.aggregate([
                    { $match: { _id: {$in: ids }}},
                    { $addFields: {"__order": {$indexOfArray: [ ids, "$_id" ]}}},
                    { $sort: {"__order": 1 }},
                    { $lookup: { from: 'categories', localField: 'profile.categories', foreignField: '_id', as: 'profile.categories' }}
                ]).exec()
            } else {
                throw('Recommendation system error!')
            }
        })
    },

    updateRecommendation: async (updateRequest: UpdateRequest): Promise<Document> => {
        return Recommendation.findByIdAndUpdate(
            updateRequest.token,
            { $push: { histories: { $each: updateRequest.histories }}},
            { new: true }
        ).exec()
    },

    getByIdWithUserHistory: async (id: string): Promise<Document> => {
        console.log(id)
        return Recommendation.findById(id).populate([{
            path: 'histories.restaurant',
            model: 'restaurants',
            populate: {
                path: 'profile.categories',
                model: 'categories'
            }
        }, {
            path: 'users',
            model: 'users',
            populate: {
                path: 'recommendation_histories',
                model: 'recommendations',
                populate: {
                    path: 'histories.restaurant',
                    model: 'restaurants',
                    populate: {
                        path: 'profile.categories',
                        model: 'categories'
                    }
                }
            }
        }]).exec()
    },

    getById: async (id: string) : Promise<Document> => {
        return Recommendation.findById(id).populate([{
            path: 'histories.restaurant',
            model: 'restaurants',
            populate: {
                path: 'profile.categories',
                model: 'categories'
            }
        }, {
            path: 'users',
            model: 'users',
            populate: {
                path: 'profile.preference.categories.category',
                model: 'categories',
            }
        }]).exec()
    },

    populate: async (recommendation: Document): Promise<Document> => {
        return recommendation.populate([{
            path: 'histories.restaurant',
            model: 'restaurants',
            populate: {
                path: 'profile.categories',
                model: 'categories'
            }
        }, {
            path: 'users',
            model: 'users',
            populate: {
                path: 'profile.preference.categories.category',
                model: 'categories',
            }
        }]).execPopulate()
    }
}