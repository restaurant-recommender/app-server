import User, { IUser } from '../models/user.model'
import mongoose, { Document } from 'mongoose'

interface IUpdateProfileWeightRequest {
    category_id: string
    value: number
}

export const userService = {
    create: async (user: IUser): Promise<Document> => {
        user.profile.preference.categories.forEach((e) => {
            e.category = mongoose.Types.ObjectId(e.category as string)
        })
        const newUser = new User(user)
    
        return newUser.save()
    },

    update: async (id: string, user: IUser): Promise<Document> => {
        return User.findByIdAndUpdate(id, { $set: user }, { new: true }).exec()
    },

    updateProfileWeight: (id: string, body: IUpdateProfileWeightRequest[]): void => {
        console.log(body)
        body.forEach(({ category_id, value }) => {
            User.updateOne(
                { _id: mongoose.Types.ObjectId(id), 'profile.preference.categories.category': mongoose.Types.ObjectId(category_id) },
                { $set: { 'profile.preference.categories.$.value': value }}
            ).exec().then((d) => {
                console.log(d)
            }).catch((error) => {
                console.log(error)
            })
        })
    }
}