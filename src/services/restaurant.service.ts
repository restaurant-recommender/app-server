import Restaurant, { IRestaurant } from '../models/restaurant.model'
import mongoose, { Document } from 'mongoose'
import { getDuplicateRestaurant, getDetailedRestaurant } from '../utilities/restaurant'
import { googleMapsService } from './googleMaps.service'
import { pictureService } from './picture.service'


const create = async (restaurant: IRestaurant): Promise<Document | void | any> => {
    let categoryIds: [any?] = []
    restaurant.profile.categories.forEach((catrgoryName: any) => {
        categoryIds.push(mongoose.Types.ObjectId(catrgoryName))
    })
    restaurant.profile.categories = categoryIds

    const newRestaurant = new Restaurant(restaurant)
    return newRestaurant.save()
}

const createWithValidation = async (newRestaurant: IRestaurant): Promise<IRestaurant | void> => {
    return getDuplicateRestaurant(newRestaurant).then((duplidatedRestaurant: IRestaurant | void) => {
        let targetRestaurant: IRestaurant = newRestaurant
        if (duplidatedRestaurant) {
            targetRestaurant = getDetailedRestaurant(duplidatedRestaurant, newRestaurant)
            if (targetRestaurant._id == duplidatedRestaurant._id) {
                console.log('Found duplicate restaurant! Existing data has more information. Skip creating restaurant')
                return duplidatedRestaurant
            } else {
                console.log(`Found duplicate restaurant! New data has more information. Deleting (${duplidatedRestaurant._id})`)
                deleteById(duplidatedRestaurant._id)
            }
        }
        create(targetRestaurant).then((restaurant) => {
            console.log(`Create new restaurant (${restaurant._id})`)
            return restaurant
        }).catch((error) => {
            throw(error)
        })
    }).catch((error) => {
        throw(error)
    })
}

const deleteById = async (id: string): Promise<{ ok?: number }> => {
    return Restaurant.deleteOne({ _id: id }).exec()
}

const getAll = async (): Promise<Document[]> => {
    return Restaurant.find({ is_active: true }).populate({
        path: 'profile.categories',
        model: 'categories'
    }).exec()
}

const getById = async (id: string): Promise<Document> => {
    return Restaurant.findOne({
        is_active: true,
        _id: mongoose.Types.ObjectId(id)
    }).populate({
        path: 'profile.categories',
        model: 'categories'
    }).exec()
}

const getByQuery = async (query: any): Promise<Document[]> => {
    if ('categories' in query) {
        query = {
            ...query,
            'profile.categories': { $all: query.categories.map((category: string) => mongoose.Types.ObjectId(category)) }
        }
        delete query['categories']
    }
    console.log(query)
    return Restaurant.find({
        is_active: true,
        ...query
    }).populate({
        path: 'profile.categories',
        model: 'categories'
    }).exec()
}

const getByDistance = async (query: any, latitude: number, longitude: number, maxDistance?: number, limit?: number, skip?: number): Promise<IRestaurant[]> => {
    const geoNearQuery = Object.assign({
        near: {
            type: 'Point',
            coordinates: [longitude, latitude]
        },
        distanceField: 'dist.calculated',
        spherical: true,
    },
        maxDistance === null ? null : { maxDistance },
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

    try {
        return Restaurant.aggregate([
            { $geoNear: geoNearQuery },
            { $match: query },
            ...optionQuerys,
            { $lookup: { from: 'categories', localField: 'profile.categories', foreignField: '_id', as: 'profile.categories' } },
        ]).then((documents) => {
            return documents.map((document) => document as IRestaurant).map((restaurant) => ({
                ...restaurant,
                cover_url: pictureService.getPictureUrl(restaurant),
            }))
        })
    } catch (error) {
        throw (error)
    }
}

const fetchNearby = (latitude: number, longitude: number) => {
    googleMapsService.getNearbyRestaurants(latitude, longitude).then((restaurants) => {
        restaurants.forEach((restaurant) => {
            const newRestaurant: IRestaurant = {
                name: restaurant.name,
                location: {
                    type: 'Point',
                    coordinates: [restaurant.geometry.location.lng, restaurant.geometry.location.lat]
                },
                profile: {
                    categories: [],
                    rating: restaurant.rating,
                    price_range: restaurant.price_level,
                    likes: null
                },
                has_profile: false,
                open_hours: restaurant.opening_hours,
                ref: 'google',
                ref_id: restaurant.formatted_address,
                link: restaurant.url
            }
            createWithValidation(newRestaurant)
        })
    })
}

const update = async (id: string, restaurant: IRestaurant): Promise<Document> => {
    let categoryIds: [any?] = []
    restaurant.profile.categories.forEach((catrgoryName: any) => {
        categoryIds.push(mongoose.Types.ObjectId(catrgoryName))
    })
    restaurant.profile.categories = categoryIds
    
    return Restaurant.findByIdAndUpdate(id, { $set: restaurant }, { new: true }).exec()
}

export const restaurantService = {
    create,
    deleteById,
    getAll,
    getById,
    getByQuery,
    getByDistance,
    createWithValidation,
    fetchNearby,
    update,
}