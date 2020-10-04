import mongoose from "mongoose"

const schema = new mongoose.Schema({
    username: String,
    profile: {
        type: {
            age: Number,
            gender: String,
            preferences: [String],
        }
    },
    behavior: {
        type: [{
            restaurant_id: String,
            is_love: Boolean,
            rating: Number,
            interact_date: Date,
        }]
    },
    is_active: {
        type: Boolean,
        default: true,
    },
})

export default mongoose.model("users", schema)