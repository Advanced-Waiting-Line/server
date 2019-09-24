//connect to mongoose and require env
const mongooseConnect = require('./extend appjs/mongooseConnect')

const express = require('express')
const app = express()

const cors = require('cors')
const route = require('./routes/index')
const errorHandler = require('./middlewares/errorHandler')

//initialize mongoose connect
mongooseConnect()

//body parser and cors
app.use(express.json({limit: '5mb'}))
app.use(express.urlencoded({extended: false, limit: '5mb'}))
app.use(cors())
app.use(require('morgan')('dev'));

//routes and error handling
app.use('/', route)
app.use(errorHandler)

//cron for clear company queue at 00.00
const cron = require('./extend appjs/cron')
cron()

module.exports = app