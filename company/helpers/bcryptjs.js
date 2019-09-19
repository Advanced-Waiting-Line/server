const bcrypt = require('bcryptjs');

module.exports = {
  generatePassword(password){
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash
  },

  comparePassword(inputPassword, hash){
    return bcrypt.compareSync(inputPassword, hash);
  }
}