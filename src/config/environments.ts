import dotenv from 'dotenv'

dotenv.config()

export default {
    mongoURL: process.env.MONGODB_URL ?? '',
    port: process.env.PORT ?? '',
    appSecret: process.env.APP_SECRET ?? '',
}