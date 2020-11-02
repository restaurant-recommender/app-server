import mongoose from 'mongoose'
import { categoryInterface } from './category.model'
import { recommendationInterface } from './recommendation.model'

export interface userInterface {
    username: string
    profile: {
        gender: 'male' | 'female'
        birthdate: Date
        preference: {
            categories: string[] | categoryInterface[]
            price_range: number
            prefer_nearby: boolean
        }
    }
    recommendation_histories: string[] | recommendationInterface[]
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
                    categories: [{
                        type: mongoose.Types.ObjectId,
                        ref: 'categories'
                    }],
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