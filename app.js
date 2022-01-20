const path = require('path')
require('dotenv').config()
require('./config/database').connect()
const express = require('express')
const authRouter = require('./routes/auth.route')
const paymentRouter = require('./routes/payment.route')
const app = express()

console.log(path.join(__dirname))

app.use(express.json())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1', paymentRouter)

module.exports = app
