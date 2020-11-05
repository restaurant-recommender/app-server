import mongoose from 'mongoose'
import { ICategory } from './category.model'
import { IRecommendation } from './recommendation.model'

export interface IUser {
    username: string
    profile: {
        gender: 'male' | 'female'
        birthdate: Date
        preference: {
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
    profile: {
        type: {
            gender: String,
            birthdate: Date,
            preference: {
                type: {
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
export default mongoose.model('users', schema)