import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import router from './routes'
import env from './environments'

const app = express()

// config
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

// database
mongoose.connect(env.mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
mongoose.set('useCreateIndex', true)

// routes
app.use('/', router)

export default app