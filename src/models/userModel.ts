import mongoose from "mongoose"
import { restaurantSchema } from "./restaurantModel"

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
    behavior: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recommendations',
    }],
    is_active: {
        type: Boolean,
        default: true,
    },
})

export const userSchema = schema
export default mongoose.model("users", schema)