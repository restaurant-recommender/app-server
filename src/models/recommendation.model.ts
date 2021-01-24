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
    members: IMember[]
    location: IPoint
    created_at: Date
    completed_at: Date
    rating: number
    group_pin: string
    type: string
    is_completed: boolean
    is_started: boolean
    is_active: boolean
    is_group: boolean
}

export interface IMember {
    _id: any
    username: string
    categories: string[]
    price_range: number
    rank: string[]
    is_head: boolean
}

const historySchema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Types.ObjectId,
        ref: 'restuarants'
    },
    is_love: Boolean,
    is_skip:  {
        type: Boolean,
        default: false,
    },
    rating: Number,
    timestamp: Date,
})

const memberSchema = new mongoose.Schema({
    username: String,
    categories: [String],
    price_range: Number,
    rank: [String],
    is_head: Boolean,
})

const schema = new mongoose.Schema({
    histories: [historySchema],
    // users: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'users',
    // }],
    members: [memberSchema],
    location: pointSchema,
    created_at: Date,
    completed_at: Date,
    rating: Number,
    type: String,
    group_pin: String,
    is_group: Boolean,
    is_started: {
        type: Boolean,
        default: false,
    },
    is_completed: {
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