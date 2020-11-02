import Recommendation, { recommendationInterface } from '../models/recommendation.model'
import Restaurant from '../models/restaurant.model'
import User from '../models/user.model'
import { InitialRequest, UpdateRequest } from '../controllers/recommendation.controller'
import mongoose, { Document } from 'mongoose'
import axios from 'axios'
import env from '../config/environments'

export const recommendationService = {
    initializeRecommendation: async (initialRequest: InitialRequest): Promise<void | Document> => {
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
            const recommendation: recommendationInterface = result.toObject()
            recommendation.users.forEach((userId: any) => {
                User.findByIdAndUpdate(userId,
                    { $push: { recommendation_histories: mongoose.Types.ObjectId(recommendation._id) }}
                ).exec()
            })
            return result
        })
    },

    getRecommendation: async (recommendation: recommendationInterface): Promise<Document[]>  => {
        return axios.post(`${env.recommenderURL}/recommend/nearby`, recommendation).then((result) => {
            if (result.data.status) {
                return Restaurant.find({
                    _id: { $in: result.data.restaurant_ids.map((id: any) => mongoose.Types.ObjectId(id)) }
                }).exec()
            } else {
                throw('Recommendation system error!')
            }
        })
    },

    updateRecommendation: async (updateRequest: UpdateRequest): Promise<Document> => {
        return Recommendation.findByIdAndUpdate(
            updateRequest.token,
            { $push: { histories: { $each: updateRequest.histories }}},
            { upsert: true }
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
    }
}