const Company = require('../model/Company')
const { comparePassword } = require('../helpers/bcryptjs')
const { generateToken } = require('../helpers/jwt')
// const { OAuth2Client } = require('google-auth-library');
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class CompanyController {
  static register(req, res, next) {
    let input = {}
    if (req.file){
      req.file.cloudStoragePublicUrl && (input.image = req.file.cloudStoragePublicUrl)
    }
    req.body.openTime && (input.openTime = req.body.openTime)
    req.body.closeTime && (input.closeTime = req.body.closeTime)
    req.body.location && (input.location = req.body.location)
    req.body.email && (input.email = req.body.email)
    req.body.password && (input.password = req.body.password)
    req.body.queue && (input.queue = req.body.queue)
    Company.create(input)
      .then((company) => {
        res.status(201).json(company)
      })
      .catch(next)
  }

  static login(req, res, next) {
    Company.findOne({
      email: req.body.email
    })
      .then((company) => {
        if (company) {
          if (comparePassword(req.body.password, company.password)) {
            let payload = {
              _id: company._id,
              name: company.name,
              email: company.email
            }
            let token = generateToken(payload)

            res.status(200).json({
              token,
              _id: company._id,
              name: company.name,
              email: company.email,
              isAdmin: company.isAdmin
            })
          }
          else {
            throw { code: 401, message: "wrong email/password" }
          }
        }
        else {
          throw { code: 401, message: "wrong email/password" }
        }
      })
      .catch(next)
  }

  static clearQueue (req, res, next) {
    Company.updateOne({
      _id: req.params.id
    }, {queue: []})
      .then((status) => {
        res.status(200).json(status)
      })
      .catch(next)
  }

  // static loginGoogle(req, res, next) {
  //   console.log('================', process.env.GOOGLE_CLIENT_ID)
  //   client.verifyIdToken({
  //     idToken: req.body.idToken,
  //     audience: process.env.GOOGLE_CLIENT_ID
  //   })
  //     .then((ticket) => {
  //       let { name, email } = ticket.getPayload()
  //       let password = process.env.PASSWORD_DEFAULT
  //       let input = { name, email, password }
  //       return Promise.all([User.findOne({ email: email }), input])
  //     })
  //     .then(([foundUser, input]) => {
  //       if (foundUser) {
  //         return foundUser
  //       }
  //       else {
  //         return User.create(input)
  //       }
  //     })
  //     .then((user) => {
  //       let payload = {
  //         _id: user._id,
  //         name: user.name,
  //         email: user.email,
  //       }
  //       let token = generateToken(payload)

  //       res.status(201).json({
  //         token,
  //         _id: user._id,
  //         name: user.name,
  //         email: user.email
  //       })
  //     })
  //     .catch(next)
  // }
}

module.exports = CompanyController