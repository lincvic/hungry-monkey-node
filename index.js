const express = require('express')
const loggerMidlleware = require('./src/middleware/logger')
const config = require('./src/CONFIG')
const app = express()

app.use(loggerMidlleware)
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/api/user/', require('./src/router/user-router'))
app.use('/api/restaurant/', require('./src/router/restaurant-router'))
app.use('/api/restaurant/menu', require('./src/router/menu-router'))
app.use('/api/order/', require('./src/router/order-router'))


app.get("/", (req, res) => {
    req.log.info('Request get')
    res.send("Server Started!")
})

app.listen(config.port, () => {
    console.log(`Server start at port ${config.port}`)
})