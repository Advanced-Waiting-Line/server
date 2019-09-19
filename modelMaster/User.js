const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {generatePassword} = require('./helpers/bcryptjs')

let UserSchema = new Schema ({
  firstName: {
    type: String,
    required: [true, "first cannot be empty"]
  },
  lastName: {
    type: String,
    required: [true, "last cannot be empty"]
  },
  email: {
    type: String,
    validate: [{
      validator: function validateFormat(email){
        let format = /\S+@\S+\.\S+/;
        return format.test(email)
      },
      message : props => `${props.value} is not a valid email`
    },{
      validator: function checkUnique(email){
        return User.findOne({email: this.email})
          .then((user)=>{
            if (user){
              return false
            }
            else {
              return true
            }
          })
          .catch((err)=>{
            return false
          })
      },
      message : props => `Email ${props.value} has been used`
    }],
    required: [true, 'email cannot be emtpy']
  },
  password: {
    type: String,
    minlength:[8,"Password minimum length is 8"],
    required: [true, 'password cannot be empty']
  },
  location: {
    type: String,
    required: [true, 'password cannot be empty']
  },
},{timestamps: true})

UserSchema.pre('save', function(next){
  this.password = generatePassword(this.password)
  next()
})

let User = mongoose.model ('User', UserSchema)

module.exports = User