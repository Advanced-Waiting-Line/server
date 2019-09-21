if (process.env.NODE_ENV=='test') {
  require('dotenv').config()
}

const express = require('express')
const app = express()

const cors = require('cors')
const route = require('./routes/index')
const errorHandler = require('./middlewares/errorHandler')
const cron = require('node-cron');
const mongoose = require('mongoose')
const Company = require('./model/Company')

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
  {useNewUrlParser: true, useUnifiedTopology: true}, function(err){
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

cron.schedule('0 0 * * *', () => {
  // Setiap 7 detik (untuk keperluan contoh: */7 * * * * *
  // console.log('running a task every second');
  Company.updateMany({}, {queue: []})
    .then((status) => {
      console.log('company queue cleared')
    })
    .catch((err)=>{
      console.log(err)
    })
})

module.exports = app