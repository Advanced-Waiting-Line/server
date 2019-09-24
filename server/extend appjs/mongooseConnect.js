if (process.env.NODE_ENV=='test') {
  require('dotenv').config()
}

module.exports = () => {
  const mongoose = require('mongoose')
  // === database ===
  if (process.env.NODE_ENV=='test'){
      mongoose.connect(`mongodb://localhost/${process.env.MONGODB_COLLECTION}-${process.env.NODE_ENV}`, 
    { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
      if (err) throw err
      else console.log('mongoose connected to mongodb localhost')
    })
  }
  else {
    /* istanbul ignore next: can't test cron */
    mongoose.connect(`mongodb+srv://mongodb:${process.env.MONGODB}@cluster0-qtldw.gcp.mongodb.net/${process.env.MONGODB_COLLECTION}?retryWrites=true&w=majority`, 
    {useNewUrlParser: true, useUnifiedTopology: true}, function(err){
      /* istanbul ignore next: can't test cron */
      if (err) throw err
      else console.log('mongoose connected to mongodb atlas')
    })
    // mongoose.connect(`mongodb+srv://admin:admin@master-cluster-nwspo.mongodb.net/${process.env.MONGODB_COLLECTION}?retryWrites=true&w=majority`, 
    // {useNewUrlParser: true, useUnifiedTopology: true}, function(err){
    //   if (err) throw err
    //   else console.log('mongoose connected to mongodb atlas')
    // })
  }
}