import Restaurant, { restaurantInterface } from '../models/restaurant.model'
import mongoose, { Document } from 'mongoose'

export const restaurantService = {
    create: async(restaurant: restaurantInterface): Promise<Document | void> => {
        let categoryIds: [any?] = []
        restaurant.profile.categories.forEach((catrgoryName: any) => {
            categoryIds.push(mongoose.Types.ObjectId(catrgoryName))
        })
        restaurant.profile.categories = categoryIds

        const newRestaurant = new Restaurant(restaurant)
        return newRestaurant.save()
    },

    deleteById: async(id: string): Promise<{ ok?: number }> => {
        return Restaurant.deleteOne({ _id: id }).exec()
    },

    getAll: async(): Promise<Document[]> => {
        return Restaurant.find({ is_active: true }).populate({
            path: 'profile.categories',
            model: 'categories'
        }).exec()
    },

    getById: async(id: string): Promise<Document> => {
        return Restaurant.findOne({
            is_active: true,
            _id: mongoose.Types.ObjectId(id)
        }).populate({
            path: 'profile.categories',
            model: 'categories'
        }).exec()
    },

    getByQuery: async(query: any): Promise<Document[]> => {
        return Restaurant.find({
            is_active: true,
            ...query}).populate({
            path: 'profile.categories',
            model: 'categories'
        }).exec()
    },

    getByDistance: async (latitude: number, longitude: number, maxDistance?: number, limit?: number, skip?: number): Promise<[restaurantInterface?]> => {
        const geoNearQuery = Object.assign({
                near: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                },
                distanceField: 'dist.calculated',
                spherical: true,
            },
            maxDistance === null ? null : {maxDistance},
        )

        let optionQuerys: any[] = []
        if (limit && !skip) {
            optionQuerys = [
                { $limit: limit }
            ]
        } else if (!limit && skip) {
            optionQuerys = [
                { $skip: skip }
            ]
        } else if (limit && skip) {
            optionQuerys = [
                { $limit: skip + limit },
                { $skip: skip },
            ]
        }

        console.log(optionQuerys)
        console.log(skip)
        console.log(limit)

        try {
            return Restaurant.aggregate([
                { $geoNear: geoNearQuery },
                ...optionQuerys,
                { $lookup: {from: 'categories', localField: 'profile.categories', foreignField: '_id', as: 'profile.categories'} },
            ]).exec()
        } catch (error) {
            throw(error)
        }
    }
}