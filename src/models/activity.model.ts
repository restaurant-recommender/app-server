import mongoose from 'mongoose'

export interface IActivity {
    _id: string
    user_id: string
    username: string
    event: string
    timestamp: Date
}

const schema = new mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    username: String,
    event_id: Number,
    event_name: String,
    context: String,
    timestamp: Date,
})

export const activitySchema = schema
export default mongoose.model('activities', schema)