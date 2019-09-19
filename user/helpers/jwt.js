const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET

module.exports = {
  generateToken(payload){
    return jwt.sign(payload, secret, {expiresIn: 3600 * 60});
  },
  
  verifyToken(token){
    return jwt.verify(token,secret)
  }
}