import mongoose from 'mongoose'
import { categoryInterface } from './category.model'

export interface restaurantInterface {
    _id: string
    name: string
    profile: {
        categories: [string?] | [categoryInterface?]
        price_range: number
        rating: number
        likes: number
    }
    address: string
    location: pointInterface
    open_hours: [{
        key: string
        value: string
    }],
    phone_no: string
    cover_url: string
    ref_id: string
    is_active: boolean
}

export interface pointInterface {
    type: string
    coordinates: [number, number]
}

const openHoursSchema = new mongoose.Schema({
    key: String,
    value: String,
}, { _id: false })

export const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
}, { _id: false })

const schema = new mongoose.Schema({
    name: String,
    profile: {
        type: {
            categories: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'categories',
            }],
            price_range: Number,
            rating: Number,
            likes: Number,
        }
    },
    address: String,
    location: pointSchema,
    open_hours: [openHoursSchema],
    phone_no: String,
    cover_url: String,
    ref_id: String,
    is_active: {
        type: Boolean,
        default: true,
    },
})

schema.index({location: '2dsphere'})

export const restaurantSchema = schema
export default mongoose.model('restaurants', schema)