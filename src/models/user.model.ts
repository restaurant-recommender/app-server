import mongoose from 'mongoose'
import { ICategory } from './category.model'
import { IRecommendation } from './recommendation.model'

export interface IPreference {
    _id: string
    name_en: string
    order: number
}

export interface IUser {
    _id: string
    username: string
    password: string
    has_profile: boolean
    profile?: {
        gender: 'male' | 'female'
        birthdate: Date
        preference: {
            ordered_categories: IPreference[]
            categories: {
                category: string | mongoose.Types.ObjectId | ICategory
                value: number
                original_value: number
            }[]
            price_range: number
            prefer_nearby: boolean
        }
    }
    recommendation_histories: string[] | IRecommendation[]
    is_active: boolean
}

const schema = new mongoose.Schema({
    username: String,
    password: String,
    has_profile: Boolean,
    profile: {
        type: {
            gender: String,
            birthdate: Date,
            preference: {
                type: {
                    ordered_categories: {
                        type: {
                            _id: String,
                            name_en: String,
                            order: Number,
                        }
                    },
                    categories:{
                        type: {
                            category: {
                                type: mongoose.Types.ObjectId,
                                ref: 'categories'
                            },
                            value: Number,
                            original_value: Number,
                        }
                    },
                    price_range: Number,
                    prefer_nearby: Boolean,
                }
            },
        }
    },
    recommendation_histories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recommendations',
    }],
    is_active: {
        type: Boolean,
        default: true,
    },
})

export const userSchema = schema
export const User = mongoose.model('users', schema)

export default User