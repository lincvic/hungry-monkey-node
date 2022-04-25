const express = require('express')
const loggerMidlleware = require('./middleware/logger')
const config = require('./CONFIG')
const app = express()

app.use(loggerMidlleware)
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/api/user/', require('./router/user-router'))
app.use('/api/restaurant/', require('./router/restaurant-router'))

app.get("/", (req, res) => {
    req.log.info('Request get')
    res.send("Server Started!")
})

app.listen(config.CONFIG.port, () => {
    console.log(`Server start at port ${config.CONFIG.port}`)
})