import mongoose from 'mongoose'
import { IRestaurant } from './restaurant.model'

export interface IReport {
    restaurant: string | mongoose.Types.ObjectId | IRestaurant
    username: string
    message: string
}

const schema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
    },
    username: String,
    message: String,
})

export const reportSchema = schema
export default mongoose.model('reports', schema)