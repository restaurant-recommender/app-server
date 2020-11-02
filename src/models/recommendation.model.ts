import mongoose from 'mongoose'
import { pointSchema, restaurantInterface, pointInterface } from './restaurant.model'
import { userInterface } from './user.model'

export interface HistoryInterface {
    restaurant: string | restaurantInterface
    is_love: boolean
    timestamp: Date
}

export interface recommendationInterface {
    _id: string
    histories: HistoryInterface[]
    users: string[] | userInterface[]
    location: pointInterface
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