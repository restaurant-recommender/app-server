import mongoose, { mongo } from 'mongoose'

var openHoursSchema = new mongoose.Schema({
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