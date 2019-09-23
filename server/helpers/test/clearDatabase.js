const Company = require('../../model/Company')
const User = require('../../model/User')
const QueueLog = require('../../model/QueueLog')

module.exports = function (done){
  if (process.env.NODE_ENV == 'test'){
    let clear = [Company.deleteMany({}), User.deleteMany({}), QueueLog.deleteMany({})]

    Promise.all(clear)
      .then(function(){
        done()
      })
      .catch(function(err){
        done(err)
      })
  }
}