import mongoose from 'mongoose'
import { pointSchema, IRestaurant, IPoint } from './restaurant.model'
import { IUser } from './user.model'

export interface IHistory {
    restaurant: string | IRestaurant
    is_love: boolean
    rating: number
    timestamp: Date
}

export interface IRecommendation {
    _id: string
    histories: IHistory[]
    users: string[] | IUser[]
    location: IPoint
    created_at: Date
    completed_at: Date
    rating: number
    is_complete: boolean
    is_active: boolean
}

const historySchema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Types.ObjectId,
        ref: 'restuarants'
    },
    is_love: Boolean,
    rating: Number,
    timestamp: Date,
})

const schema = new mongoose.Schema({
    histories: [historySchema],
    users: [{
        type: mongoose.Types.ObjectId,
        ref: 'users',
    }],
    location: pointSchema,
    created_at: Date,
    completed_at: Date,
    rating: Number,
    is_complete: {
        type: Boolean,
        default: false,
    },
    is_active: {
        type: Boolean,
        default: true,
    },
})

export const recommendationSchema = schema
export default mongoose.model('recommendations', schema)