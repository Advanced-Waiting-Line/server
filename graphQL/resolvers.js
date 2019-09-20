const axios = require('axios')
const awanUrl = 'http://localhost:3000'

const resolvers = {
  Query: {
  },
  Mutation: {
    registerCompany: async (parent, { openTime, closeTime, location, email, password, queue }, context, info) => {
      let input = {}
      openTime && (input.openTime = openTime)
      closeTime && (input.closeTime = closeTime)
      location && (input.location = location)
      email && (input.email = email)
      password && (input.password = password)
      queue && (input.queue = queue)
      // console.log(input)
      const { data } = await axios.post(`${awanUrl}/companies/register`, input)
      return data
    },
    loginCompany: async (parent, { email, password }, context, info) => {
      let input = {}
      email && (input.email = email)
      password && (input.password = password)
      // console.log(input)
      const { data } = await axios.post(`${awanUrl}/companies/login`, input)
      console.log(data)
      return data
    },
    registerUser: async (parent, { firstName, lastName, image, email, password, location }, context, info) => {
      let input = {}
      firstName && (input.firstName = req.body.firstName)
      lastName && (input.lastName = req.body.lastName)
      image && (input.image = req.body.image)
      email && (input.email = req.body.email)
      password && (input.password = req.body.password)
      location && (input.location = req.body.location)
      // console.log(input)
      const { data } = await axios.post(`${awanUrl}/users/register`, input)
      return data
    },
    loginUser: async (parent, { email, password }, context, info) => {
      let input = {}
      email && (input.email = email)
      password && (input.password = password)
      // console.log(input)
      const { data } = await axios.post(`${awanUrl}/users/login`, input)
      console.log(data)
      return data
    }
  }
}

module.exports = resolvers
