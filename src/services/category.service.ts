
import Category, { ICategory } from '../models/category.model'

interface CommonCetegory {
    name_th: string
    name_en: string
    name: string
    _id: string
    order: number
}

const getCommonCetegories = async (lang: string = 'en'): Promise<CommonCetegory[]> => {
    const categories = await Category.find({ is_common: true })
    const commonCetegories: CommonCetegory[] = categories.map((categoryDocument) => {
        const category: ICategory = categoryDocument.toObject()
        return {
            name_th: category.name_th,
            name_en: category.name_en,
            name: lang === 'en' ? category.name_en : category.name_th,
            order: category.order,
            _id: category._id,
        }
    })
    const sortedCommonCategories = commonCetegories.sort((a, b) => a.order - b.order)
    return sortedCommonCategories
}

export const categoryService = {
    getCommonCetegories,
}