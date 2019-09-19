const User = require('../../modelMaster/User')
const { comparePassword } = require('../helpers/bcryptjs')
const { generateToken } = require('../helpers/jwt')
// const { OAuth2Client } = require('google-auth-library');
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class UserController {
  static register(req, res, next) {
    let {firstName, lastName, email, password} = req.body
    let isAdmin = false
    User.create({name, email, isAdmin, password})
      .then((user) => {
        res.status(201).json(user)
      })
      .catch(next)
  }

  static login(req, res, next) {
    User.findOne({
      email: req.body.email
    })
      .then((user) => {
        if (user) {
          if (comparePassword(req.body.password, user.password)) {
            let payload = {
              _id: user._id,
              name: user.name,
              email: user.email
            }
            let token = generateToken(payload)

            res.status(200).json({
              token,
              _id: user._id,
              name: user.name,
              email: user.email,
              isAdmin: user.isAdmin
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

module.exports = UserController