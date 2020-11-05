import mongoose from 'mongoose'

export interface ICategory {
    name_th: string
    name_en: string
    ref_id: string
    is_visible: boolean
    is_common: boolean
    is_active: boolean
}

const schema = new mongoose.Schema({
    name_th: String,
    name_en: String,
    ref_id: String,
    is_visible: Boolean,
    is_common: Boolean,
    is_active: {
        type: Boolean,
        default: true,
    },
})

export const categorySchema = schema
export default mongoose.model('categories', schema)