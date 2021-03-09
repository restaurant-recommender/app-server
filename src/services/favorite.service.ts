import Favorite, { IFavorite } from '../models/favorite.model'
import mongoose from 'mongoose'
import { IRestaurant } from '../models/restaurant.model'

const getFavoriteRestaurantsByUserId = async (id: string): Promise<IRestaurant[]> => {
    console.log(id)
    return Favorite
        .find({ user: mongoose.Types.ObjectId(id) })
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
            console.log(data)
            if (data.length == 0) {
                return []
            } else {
                return data[0].toObject().restaurants as IRestaurant[]
            }
        })  
}

const addFaveoriteRestaurant = async (userId: string, restaurantId: string): Promise<void> => {
    return Favorite.findOne({ 
        user: mongoose.Types.ObjectId(userId),
    }).then((favorite) => {
        if (favorite) {
            Favorite.findOneAndUpdate(
                { 
                    user: mongoose.Types.ObjectId(userId),
                    restaurants: { $ne: mongoose.Types.ObjectId(restaurantId) },
                },
                { $push: { restaurants: mongoose.Types.ObjectId(restaurantId) } },
                { upsert: true },
            ).exec().then(_ => {
                return
            })
        } else {
            const newFavorite = new Favorite({
                user: mongoose.Types.ObjectId(userId),
                restaurants: [mongoose.Types.ObjectId(restaurantId)],
            })
            newFavorite.save().then(_ => {
                return
            })
        }
    })
}

const removeFaveoriteRestaurant = async (userId: string, restaurantId: string): Promise<void> => {
    Favorite.findOneAndUpdate(
        { user: mongoose.Types.ObjectId(userId) },
        { $pull: { restaurants: mongoose.Types.ObjectId(restaurantId) } },
    ).exec()
}

const hasFavoriteRestaurant = async (userId: string, restaurantId: string): Promise<boolean> => {
    return Favorite.findOne({ 
        user: mongoose.Types.ObjectId(userId),
        restaurants: mongoose.Types.ObjectId(restaurantId),
    }).then((favorite) => {
        return favorite ? true : false
    })
}

export const favoriteService = {
    getFavoriteRestaurantsByUserId,
    addFaveoriteRestaurant,
    removeFaveoriteRestaurant,
    hasFavoriteRestaurant,
}