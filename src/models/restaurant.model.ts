import mongoose from 'mongoose'
import { ICategory } from './category.model'

export interface IScore {
    pref_score?: number
    rank_score?: number
    price_score?: number
    norm_pref_score?: number
    norm_rank_score?: number
    norm_price_score?: number
    sum_score?: number
}

export interface IRestaurant {
    _id?: string
    name: string
    has_profile: boolean
    profile?: {
        categories: string[] | ICategory[]
        price_range: number
        rating: number
        likes: number
    }
    address?: string
    location: IPoint
    open_hours?: [{
        key: string
        value: string
    }] | any,
    phone_no?: string
    cover_url?: string
    ref: string
    ref_id: string
    link: string
    is_active?: boolean
    dist?: {
        calculated: number
    }
    score?: IScore
}

export interface IPoint {
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
    has_profile: Boolean,
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
    ref: String,
    ref_id: String,
    link: String,
    score: mongoose.Schema.Types.Mixed,
    dist: {
        type: {
            calculated: Number
        }
    },
    is_active: {
        type: Boolean,
        default: true,
    },
})

schema.index({location: '2dsphere'})

export const restaurantSchema = schema
export default mongoose.model('restaurants', schema)