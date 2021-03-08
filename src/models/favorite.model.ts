import mongoose from 'mongoose'
import { IRestaurant } from './restaurant.model'
import { IUser } from './user.model'

export interface IFavorite {
    _id: string
    user: IUser
    restaurants: IRestaurant[]
}

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    restaurants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
    }],
})

export const favoriteSchema = schema
export default mongoose.model('favorites', schema)