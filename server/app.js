if (process.env.NODE_ENV=='test') {
  require('dotenv').config()
}

const express = require('express')
const app = express()

const cors = require('cors')
const route = require('./routes/index')
const errorHandler = require('./middlewares/errorHandler')

const mongoose = require('mongoose')

// === database ===
if (process.env.NODE_ENV=='test'){
    mongoose.connect(`mongodb://localhost/${process.env.MONGODB_COLLECTION}-${process.env.NODE_ENV}`, 
  { useNewUrlParser: true }, function (err) {
    if (err) throw err
    else console.log('mongoose connected to mongodb localhost')
  })
}
else {
  mongoose.connect(`mongodb+srv://mongodb:${process.env.MONGODB}@cluster0-qtldw.gcp.mongodb.net/${process.env.MONGODB_COLLECTION}?retryWrites=true&w=majority`, 
  {useNewUrlParser: true}, function(err){
    if (err) throw err
    else console.log('mongoose connected to mongodb atlas')
  })
}

//body parser and cors
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())

//routes and error handling
app.use('/', route)
app.use(errorHandler)

module.exports = app