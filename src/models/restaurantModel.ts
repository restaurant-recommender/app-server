import mongoose from "mongoose"

const schema = new mongoose.Schema({
    name: String,
    profile: {
        type: {
            categories: [String],
            price: Number,
        }
    },
    location: {
        type: {
            address: String,
            latitude: String,
            longitude: String,
        }
    },
    is_active: {
        type: Boolean,
        default: true,
    },
})

export default mongoose.model("restaurants", schema)