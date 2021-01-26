import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import router from './routes'
import env from './environments'
import { Socket } from 'dgram'

const app = express()

const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});

// require('@google-cloud/debug-agent').start({serviceContext: {enableCanary: true}});

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

// socket io
io.on('connection', function(socket: Socket) {
    // console.log('A user connected');

    socket.on('group-update', (id: string) => {
        console.log('new update')
        io.emit('group-update', id);
    });

    socket.on('group-rank-update', (id: string) => {
        console.log('new rank update')
        io.emit('group-rank-update', id);
    });

    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
    //    console.log('A user disconnected')
    })
})

export default http