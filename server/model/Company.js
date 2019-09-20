const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {generatePassword} = require('../helpers/bcryptjs')

let CompanySchema = new Schema ({
  openTime: {
    type: Date,
    required: [true, "date cannot be empty"]
  },
  closeTime: {
    type: Date,
    required: [true, "date cannot be empty"]
  },
  image : {
    type: String,
    required: [true, "user image cannot be empty"]
  },
  location: {
    type: String
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
        return Company.findOne({email: this.email})
          .then((company)=>{
            if (company){
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
  queue: {
    type: String
  },
},{timestamps: true})

CompanySchema.pre('save', function(next){
  this.password = generatePassword(this.password)
  next()
})

let Company = mongoose.model ('Company', CompanySchema)

module.exports = Company