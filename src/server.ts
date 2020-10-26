import app from './config/app'
import env from './config/environments'

app.listen(env.port, () => {
    console.log(`Express server listening on port: ${env.port}`)
})