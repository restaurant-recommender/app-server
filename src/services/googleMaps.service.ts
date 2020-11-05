import { Client } from '@googlemaps/google-maps-services-js'

export const googleMapsService = {
    getNearbyRestaurants: (latitude: number, longitude: number) => {
        const client = new Client({})
        const params: any = {
            location: [latitude, longitude],
            type: 'restaurant',
            radius: 1000,
            key: process.env.GOOGLE_MAPS_API_KEY,
        }
    
        return client.placesNearby({ params: params }).then((result) => {
            return result.data.results
        }).catch((error) => { throw(error) })
    }
}