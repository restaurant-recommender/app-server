import mongoose from "mongoose"

const schema = new mongoose.Schema({
    name_th: String,
    name_en: String,
    ref_id: String,
    is_visible: Boolean,
    is_active: {
        type: Boolean,
        default: true,
    },
})

export const categorySchema = schema
export default mongoose.model("categories", schema)