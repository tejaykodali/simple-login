require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('express-async-errors')

const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const url = process.env.MONGODB_URI
mongoose.set('strictQuery', false)
mongoose.connect(url)

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

module.exports = app
