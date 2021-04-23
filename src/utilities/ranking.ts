import { ICategory } from "../models/category.model"
import { IRecommendation } from "../models/recommendation.model"
import { IRestaurant } from "../models/restaurant.model"
import { combination } from "./array"

export const rank = (ranks: string[][]): string[] => {
    const scores: any = {}
    ranks.forEach((r) => {
        r.forEach((restaurantId, index) => {
            const score = r.length - index
            if (restaurantId in scores) {
                scores[restaurantId] += score
            } else {
                scores[restaurantId] = score
            }
            
        })
    })
    let sortableRank: any = [];
    for (var restaurantId in scores) {
        sortableRank.push([restaurantId, scores[restaurantId]]);
    }
    return sortableRank.sort((a: any, b: any) => b[1] - a[1]).map((item: any) => item[0])
}

export const arregateRank = (recommendation: IRecommendation): IRestaurant[] => {
    // console.log(recommendation.sugessted_restaurants)
    // console.log(recommendation.members)
    const restaurants = recommendation.sugessted_restaurants
    const restaurantLength = restaurants.length
    const categoryLength = 5
    const users = recommendation.members
    const userCombinations = combination(recommendation.members)
    // console.log(userCombinations)
    restaurants.forEach(restaurant => {
        restaurant.score = {}

        // preference score
        let preferenceScore = 0
        users.forEach(user => {
            user.categories.forEach((category, index) => {
                if ((restaurant.profile.categories as ICategory[]).map(category => category.name_en).indexOf(category) !== -1) {
                    preferenceScore += categoryLength - index
                }
            })
        })

        // rank score
        let rankScore = 0
        users.forEach(user => {
            rankScore += restaurantLength - user.rank.indexOf(restaurant._id.toString())
        })
        // rank distance score
        let sumDistanceScore = 0
        userCombinations.forEach(([user1, user2]) => {
            const distanceScore = Math.pow(user1.rank.indexOf(restaurant._id.toString()) - user2.rank.indexOf(restaurant._id.toString()), 2)
            sumDistanceScore += distanceScore
        })
        sumDistanceScore = Math.sqrt(sumDistanceScore)
        rankScore -= sumDistanceScore

        // price score
        let priceScore = 0
        if (restaurant.profile.price_range !== -1) {
            users.forEach(user => {
                if (user.price_range !== null) {
                    const gap = user.price_range - restaurant.profile.price_range
                    if (gap === 0) {
                        priceScore += 3
                    } else if (gap === 1) {
                        priceScore += 2
                    } else if (gap === 2) {
                        priceScore += 1
                    }
                }
            })
        }

        restaurant.score.pref_score = preferenceScore
        restaurant.score.rank_score = rankScore
        restaurant.score.price_score = priceScore
    })

    restaurants.forEach(restaurant => {
        restaurant.score.norm_pref_score = restaurant.score.pref_score / Math.max(...restaurants.map(restaurant => restaurant.score.pref_score))
        restaurant.score.norm_rank_score = restaurant.score.rank_score / Math.max(...restaurants.map(restaurant => restaurant.score.rank_score))
        restaurant.score.norm_price_score = restaurant.score.price_score / Math.max(...restaurants.map(restaurant => restaurant.score.price_score))
        restaurant.score.sum_score = (restaurant.score.norm_pref_score + (2 * restaurant.score.norm_rank_score) + restaurant.score.norm_price_score)
    })

    // console.log(restaurants.map(restaurant => ([restaurant.name, restaurant.score])))
    const sortedRestaurants = restaurants.sort((a, b) => b.score.sum_score - a.score.sum_score)
    // console.log(sortedRestaurants.map(r => [r.name, r.score.sum_score]))
    return sortedRestaurants
}