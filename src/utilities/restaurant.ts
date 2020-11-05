import { IRestaurant } from '../models/restaurant.model'
import { restaurantService } from '../services'
import fuzz from 'fuzzball'

export const getDuplicateRestaurant = (restaurant: IRestaurant): Promise<void | IRestaurant> => {
    const distance = 200 // meters
    const ratio = 65

    return restaurantService.getByDistance({}, restaurant.location.coordinates[1], restaurant.location.coordinates[0], distance).then((nearyByRestarants) => {
        for (let i = 0; i < nearyByRestarants.length; i++) {
            const nearByRestaurant = nearyByRestarants[i]
            if (nearByRestaurant.name.toLowerCase().replace(' ', '').includes(restaurant.name.toLowerCase().replace(' ', '')) || 
                restaurant.name.toLowerCase().replace(' ', '').includes(nearByRestaurant.name.toLowerCase().replace(' ', '')) || 
                fuzz.ratio(nearByRestaurant.name.toLowerCase(), restaurant.name.toLowerCase()) >= ratio ||
                nearByRestaurant.name === restaurant.name) {
                return nearByRestaurant
            }
        }
        return null
    })
}

export const getDetailedRestaurant = (firstRestaurant: IRestaurant, secondRestaurant: IRestaurant): IRestaurant => {
    const point = {
        perCategory: 10,
        forPriceRange: 10,
        forRating: 10,
        forCoverUrl: 5,
        forOpenHours: 5,
        forPhoneNo: 2
    }

    const calculatePoint = (restaurant: IRestaurant) => (
        (([...new Set( [restaurant.profile.categories] )]).length * point.perCategory) + 
        (restaurant.profile.price_range ? point.forPriceRange : 0) +
        (restaurant.profile.rating ? point.forRating : 0) +
        (restaurant.cover_url ? point.forCoverUrl : 0) +
        (restaurant.open_hours ? point.forOpenHours : 0) +
        (restaurant.phone_no ? point.forPhoneNo : 0)
    )

    return calculatePoint(firstRestaurant) >= calculatePoint(secondRestaurant) ? firstRestaurant : secondRestaurant
}