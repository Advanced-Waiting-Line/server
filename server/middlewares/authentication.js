const {verifyToken} = require('../helpers/jwt')

module.exports = {
  authentication : function (req,res,next){
    if(req.headers.token) {
      try {
        let decode = verifyToken(req.headers.token)
        req.decode = decode
        next()
      } 
      catch(err) {
        next(err)
      }

    }else {
      next({code: 401, message: "Login First"})
    }
  },
  authenticationCompany: function (req,res,next){
    if(req.headers.token){
      try {
        let decode = verifyToken(req.headers.token)
        req.decode = decode
        next()
      } catch(err){
        next(err)
      }
    } else {
      next({code: 401, message: "please provide a valid token"})
    }
  },

  authenticationUser: function (req,res,next){
    if(req.headers.token){
      try {
        let decode = verifyToken(req.headers.token)
        req.decode = decode
        next()
      } catch(err){
        next(err)
      }
    } else {
      next({code: 401, message: "please provide a valid token"})
    }
  }
}