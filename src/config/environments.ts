import dotenv from 'dotenv'

dotenv.config()

export default {
    mongoURL: process.env.MONGODB_URL ?? '',
    recommenderURL: process.env.RECOMMENDER_URL ?? '',
    port: process.env.PORT ?? '',
    appSecret: process.env.APP_SECRET ?? '',
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY ?? '',
    nearbyFetchEnabled: process.env.NEARBY_FETCH_ENABLED === 'TRUE' ?? false,
}