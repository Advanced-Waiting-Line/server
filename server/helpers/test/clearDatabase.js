const Company = require('../../model/Company')
const User = require('../../model/User')

module.exports = function (done){
  if (process.env.NODE_ENV == 'test'){
    let clear = [Company.deleteMany({}), User.deleteMany({})]

    Promise.all(clear)
      .then(function(){
        done()
      })
      .catch(function(err){
        done(err)
      })
  }
}