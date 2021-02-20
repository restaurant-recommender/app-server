import Recommendation, { IHistory, IRecommendation } from '../models/recommendation.model'
import mongoose from 'mongoose'

const ObjectId = mongoose.Types.ObjectId

type History = {
    restaurant: string
    love: number
    hate: number
}

export type UserHistory = {
    user: string
    histories: History[]
}


const getUserHistories = async (restaurantIds: string[], userIds: string[]): Promise<UserHistory[]> => {
    const getQuery = (userId: string) => ({
        "members._id": ObjectId(userId), 
        "histories.restaurant": { "$in": restaurantIds.map(restaurantId => ObjectId(restaurantId)) }
    })
    const getUserHistory = async (userId: string): Promise<UserHistory> => {
        return Recommendation.find(getQuery(userId)).then((documents) => {
            const recommendations = documents.map((document) => document.toObject()) as IRecommendation[]
            const histories = recommendations.reduce((accumulator, recommendation) => [...accumulator, ...recommendation.histories], []) as IHistory[]
            const targetHistories = histories.filter((history) => restaurantIds.includes(history.restaurant.toString()))
            const userHistories = targetHistories.reduce((accumulator: History[], history) => {
                const interaction = history.is_love ? 'love' : 'hate'
                if (accumulator.map(o => o.restaurant.toString()).includes(history.restaurant.toString())) {
                    accumulator.find(o => o.restaurant.toString() === history.restaurant.toString())[interaction] += 1
                } else {
                    accumulator.push({
                        restaurant: history.restaurant.toString(),
                        love: history.is_love ? 1 : 0,
                        hate: history.is_love ? 0 : 1,
                    })
                }
                return accumulator
            }, [])
            return {
                user: userId,
                histories: userHistories,
            }
        })
    }
    let userHistoryResults = await Promise.all(userIds.map((userId) => getUserHistory(userId)))
    return userHistoryResults
}

export const historyService = {
    getUserHistories,
}