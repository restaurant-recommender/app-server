import mongoose from 'mongoose'
import { pointSchema } from './restaurantModel'

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
    is_active: {
        type: Boolean,
        default: true,
    },
})

export const recommendationSchema = schema
export default mongoose.model('recommendations', schema)