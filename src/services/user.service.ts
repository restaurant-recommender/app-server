import { User, IUser, IPreference } from '../models/user.model'
import mongoose, { Document } from 'mongoose'
import bcrypt, { hash } from 'bcrypt'

interface IUpdateProfileWeightRequest {
    category_id: string
    value: number
}


interface UpdatePreferencesBody {
    preferences: IPreference[]
}

const hasUsername = async(username: string): Promise<boolean> => User.findOne({ username: username }).then((user) => user ? true : false)

const updatePreferences = async (id: string, body: UpdatePreferencesBody): Promise<boolean> => {
    const newPreferences = body.preferences
    return User.findByIdAndUpdate(id, { $set: { 'profile.preference.ordered_categories': newPreferences }}).then((_) => true)
}

const getPreferences = async (id: string): Promise<IPreference[]> => User.findById(id).then((user) => (user.toObject() as IUser).profile?.preference?.ordered_categories as IPreference[])


export const userService = {
    hasUsername,
    updatePreferences,
    getPreferences,
    
    create: async (user: IUser): Promise<Document> => {
        if (user.profile) {
            user.profile.preference.categories.forEach((e) => {
                e.category = mongoose.Types.ObjectId(e.category as string)
            })
        }
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