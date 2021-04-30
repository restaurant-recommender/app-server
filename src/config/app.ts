import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import router from './routes'
import env from './environments'

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

// socket io
io.on('connection', (socket: any) => {
    console.log('user connected');

    socket.on('group-join', (id: string) => {
        console.log('join group: ' + id)
        socket.join(id)
    })

    socket.on('group-update', (id: string) => {
        console.log('new update: ' + id)
        io.to(id).emit('group-update');
    });

    socket.on('group-rank-join', (id: string) => {
        console.log('join group rank: ' + id)
        socket.join(id)
    });

    socket.on('group-rank-update', (id: string) => {
        console.log('new rank update')
        io.to(id).emit('group-rank-update');
    });

    socket.on('disconnect', function () {
       console.log('user leave')
    })
})

// routes
app.use('/', router)

export default http