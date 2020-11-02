import { restaurantInterface } from '../models/restaurant.model'
import { restaurantService } from '../services'
import fuzz from 'fuzzball'

export const getDuplicateRestaurant = (restaurant: restaurantInterface): Promise<void | restaurantInterface> => {
    const distance = 200 // meters
    const ratio = 70

    return restaurantService.getByDistance(restaurant.location.coordinates[1], restaurant.location.coordinates[0], distance).then((nearyByRestarants) => {
        for (let i = 0; i < nearyByRestarants.length; i++) {
            const nearByRestaurant = nearyByRestarants[i]
            if (nearByRestaurant.name.toLowerCase().includes(restaurant.name.toLowerCase()) || nearByRestaurant.name.toLowerCase().includes(restaurant.name.toLowerCase()) || fuzz.ratio(nearByRestaurant.name.toLowerCase(), restaurant.name.toLowerCase()) >= ratio) {
                return nearByRestaurant
            }
            return null
        }
    })
}

export const getDetailedRestaurant = (firstRestaurant: restaurantInterface, secondRestaurant: restaurantInterface): restaurantInterface => {
    const point = {
        perCategory: 10,
        forPriceRange: 10,
        forRating: 10,
        forCoverUrl: 5,
        forOpenHours: 5,
        forPhoneNo: 2
    }

    const calculatePoint = (restaurant: restaurantInterface) => (
        (([...new Set( [restaurant.profile.categories] )]).length * point.perCategory) + 
        (restaurant.profile.price_range ? point.forPriceRange : 0) +
        (restaurant.profile.rating ? point.forRating : 0) +
        (restaurant.cover_url ? point.forCoverUrl : 0) +
        (restaurant.open_hours ? point.forOpenHours : 0) +
        (restaurant.phone_no ? point.forPhoneNo : 0)
    )

    return calculatePoint(firstRestaurant) >= calculatePoint(secondRestaurant) ? firstRestaurant : secondRestaurant
}