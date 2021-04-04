import Recommendation, { IHistory, IMember, IRecommendation } from '../models/recommendation.model'
import Restaurant, { IRestaurant } from '../models/restaurant.model'
import User, { IUser } from '../models/user.model'
import { InitialRequest, UpdateRequest } from '../controllers/recommendation.controller'
import mongoose, { Document } from 'mongoose'
import axios from 'axios'
import env from '../config/environments'
import { restaurantService } from './restaurant.service'
import { distance } from '../utilities/function'
import { rank } from '../utilities/ranking'
import { historyService } from './history.service'


const initialize = async (members: IMember[], location: [number, number], isGroup: boolean, type: string): Promise<IRecommendation> => {
    let groupPin = null
    console.log('into init')
    if (isGroup) {
        do {
            groupPin = Math.floor(100000 + Math.random() * 900000)
        } while  (await Recommendation.findOne({group_pin: groupPin, is_completed: false}).then((doc) => doc ? true : false)) 
    }
    const recommendation = new Recommendation({
        members: members,
        location: {
            type: "Point",
            coordinates: [location[1], location[0]]
        },
        created_at: Date.now(),
        is_group: isGroup,
        group_pin: groupPin,
        type: type,
    })
    console.log(recommendation)
    console.log('nre recommendation')
    return recommendation.save().then((document) => document.toObject() as IRecommendation)
}

const request = async (id: string, count: number): Promise<IRestaurant[]> => {
    return Recommendation.findById(id).then((document) => {
        const recommendation: IRecommendation = document.toObject() as IRecommendation
        return restaurantService.getByDistance({ type: recommendation.type }, recommendation.location.coordinates[1], recommendation.location.coordinates[0], 1000, 100 + recommendation.histories.length).then((restaurants) => {
            const filteredRestaurants = restaurants.filter((restaurant) => !recommendation.histories.map((history) => history.restaurant.toString()).includes(restaurant._id.toString()))
            console.log(`Available restuarants: ${filteredRestaurants.length}`)
            if (filteredRestaurants.length < 6) { // TODO: unset hard-coded value
                throw 'Cannot find more restaurants near you.'
            }
            const body = {
                restaurants: filteredRestaurants,
                users: recommendation.members,
                histories: historyService.getUserHistories(filteredRestaurants.map(restaurant => restaurant._id.toString()), recommendation.members.map(member => member._id.toString())),
            }
            return axios.post(`${env.recommenderURL}/recommend/genetic?count=${count}`, body).then((response) => {
                if (response.status) {
                    return response.data.restaurants as IRestaurant[]
                } else {
                    throw 'Recommender error!'
                }
            })
        })
    })
}

const updateHistories = async (id: string, histories: IHistory[]): Promise<boolean> => {
    return Recommendation.findByIdAndUpdate(id, { $push: { histories: { $each: histories}}}, { new: true }).then((document) => document ? true : false)
}

const updateRating = async (id: string, userId: string, rating: number): Promise<boolean> => {
    return Recommendation.findOneAndUpdate({_id: id, "members._id": userId}, { "members.$.rating": rating }).then((document) => document ? true : false)
}

const update = async (id: string, recommendation: IRecommendation): Promise<IRecommendation> => {
    return Recommendation.findByIdAndUpdate(id, recommendation, { new: true }).then((document) => document.toObject() as IRecommendation)
}

const complete = async (id: string): Promise<boolean> => {
    return Recommendation.findByIdAndUpdate(id, { is_completed: true }, { new: true }).then((document) => document ? true : false)
}

const joinGroup = async (pin:string, member: IMember): Promise<IRecommendation> => {
    return Recommendation.findOne({ group_pin: pin, is_started: false }).then((document) => {
        console.log(document)
        if (!document) {
            console.log('not found')
            // find recommendation that user existed
            return Recommendation.findOne({ group_pin: pin, 'members._id': mongoose.Types.ObjectId(member._id), is_completed: false }).then((document) => {
                console.log('existed')
                console.log(document)
                return document.toObject() as IRecommendation
            })
        }
        const recommendation = document.toObject() as IRecommendation
        if (recommendation.members.map((member) => member._id.toString()).includes(member._id.toString())) {
            // user already joined
            return recommendation
        } else {
            member._id = mongoose.Types.ObjectId(member._id)
            return Recommendation.findByIdAndUpdate(recommendation._id, { $push: { members: member } }, { new: true }).then((document) => document.toObject() as IRecommendation)
        }
    })
}


const getFinal = async (id: string): Promise<IRestaurant> => {
    return Recommendation.findById(id).then((document) => {
        const recommendation = document.toObject() as IRecommendation
        const getDistance = (restaurant: IRestaurant): number => distance(restaurant.location.coordinates[1], restaurant.location.coordinates[0], recommendation.location.coordinates[1], recommendation.location.coordinates[0])
        if (recommendation.final_restaurants && recommendation.final_restaurants.length > 0) {
            return recommendation.final_restaurants[0]
        }
        else if (recommendation.is_group) {
            // TODO: group finalization
            const orderedRestaurantIds = rank(recommendation.members.map((member) => member.rank))
            const orderedRestaurants = orderedRestaurantIds.map((restaurantId) => recommendation.sugessted_restaurants.find((restaurant) => restaurant._id.toString() === restaurantId))
            console.log(orderedRestaurants)
            Recommendation.findByIdAndUpdate(id, { $push: { final_restaurants: { $each: orderedRestaurants }}}).exec()
            return orderedRestaurants[0]
        } else {
            // individual finalization
            const finalRestaurantId = recommendation.histories.find((history) => history.is_love).restaurant as string
            return restaurantService.getById(finalRestaurantId).then((document) => {
                const restaurant = document.toObject() as IRestaurant
                const distance = getDistance(restaurant)
                const restaurantWithDistance = {
                    ...restaurant,
                    dist: {
                        calculated: distance,
                    }
                }
                Recommendation.findByIdAndUpdate(id, { $push: { final_restaurants: { $each: [restaurantWithDistance] }}}).exec()
                return restaurantWithDistance
            })
        }
    })
}

const updateMemberPreferPrice = async (recommendationId: string, userId: string, preferPrice: number) : Promise<boolean> => {
    return Recommendation.findOneAndUpdate({_id: recommendationId, "members._id": userId}, {"members.$.price_range": preferPrice}).then((document) => document ? true : false)
}

const updateMemberRestaurantRank = async (recommendationId: string, userId: string, rank: string[]) : Promise<IRecommendation> => {
    return Recommendation.findOneAndUpdate({_id: recommendationId, "members._id": userId}, {"members.$.rank": rank}, { new: true }).then((document) => {
        const recommendation = document.toObject() as IRecommendation
        if (recommendation.members.every((member) => member.rank && member.rank.length > 0)) {
            // finish recommendation
            return Recommendation.findByIdAndUpdate(recommendationId, { is_completed: true }, { new: true }).then((document) => document.toObject() as IRecommendation)
        } else {
            return recommendation
        }
    })
}

const getById = async (id: string): Promise<IRecommendation> => Recommendation.findById(id).then((document) => document.toObject() as IRecommendation)

export const recommendationService = {
    initialize,
    request,
    updateHistories,
    complete,
    getFinal,
    updateRating,
    joinGroup,
    getById,
    update,
    updateMemberPreferPrice,
    updateMemberRestaurantRank,


    initializeRecommendationDeprecated: async (initialRequest: InitialRequest): Promise<void | Document> => {
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

    getByIdDeprecated: async (id: string) : Promise<Document> => {
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
        }]).execPopulate()
    }
}