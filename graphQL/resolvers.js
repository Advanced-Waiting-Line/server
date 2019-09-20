const axios = require('axios')
const awanUrl = 'http://localhost:3000'
const FormData = require('form-data')

const resolvers = {
  Query: {
  },
  Mutation: {
    registerCompany: async (parent, { openTime, closeTime, image, location, email, password }, context, info) => {
      
      if (image){
        image ? formData.append('file', Buffer.from(image, 'base64'), 'companyImage.jpeg') : null
      }
      // console.log(openTime, closeTime, location, email, password)
      let formData = new FormData()
      openTime ? formData.append('openTime', openTime) : console.log('gak masuk')
      closeTime ? formData.append('closeTime', closeTime) : console.log('gak masuk')
      location ? formData.append('location', location) : console.log('gak masuk')
      email ? formData.append('email', email) : console.log('gak masuk')
      password ? formData.append('password', password) : console.log('gak masuk')
      console.log(formData)
      const { data } = await axios.post(`${awanUrl}/companies/register`, formData, {
        headers: {
          "Content_type": `multipart/form-data; boundary=${formData._boundary}`
        }
      })
      // return data
    },
    loginCompany: async (parent, { email, password }, context, info) => {
      let input = {}
      email && (input.email = email)
      password && (input.password = password)
      const { data } = await axios.post(`${awanUrl}/companies/login`, input)
      console.log(data)
      return data
    },
    registerUser: async (parent, { firstName, lastName, image, email, password, location }, context, info) => {
      const formData = new FormData()
      firstName ? formData.append('firstName', firstName) : null
      lastName ? formData.append('lastName', lastName) : null
      image ? formData.append('file', Buffer.from(image, 'base64'), 'userImage.jpeg') : null
      email ? formData.append('email', email) : null
      password ? formData.append('password', password) : null
      location ? formData.append('location', location) : null
      const { data } = await axios.post(`${awanUrl}/users/register`, formData, {
        headers: {
          "Content_type": `multipart/form-data; boundary=${formData._boundary}`
        }
      })
      return data
    },
    loginUser: async (parent, { email, password }, context, info) => {
      let input = {}
      email && (input.email = email)
      password && (input.password = password)
      const { data } = await axios.post(`${awanUrl}/users/login`, input)
      console.log(data)
      return data
    },
    getAllCompanyQueue:  async (_,{token, companyId}, { dataSources }) => {
      const result = await dataSources.queueAPI.getAllCompanyQueue(token, companyId)
      return result  
    },
    getTodayLog: async (_, {token, companyId}, {dataSources}) => {
      const result = await dataSources.queueAPI.getTodayLog(token, companyId)
      return result  
    },
    getOneDayLog: async (_, {token, companyId, date, month, year}, {dataSources}) => {
      const result = await dataSources.queueAPI.getOneDayLog(token, companyId, date, month, year)
      return result  
    },
    createQueue: async (_, {token, companyId, userId, problemId}, {dataSources}) => {
      const result = await dataSources.queueAPI.createQueue(token, companyId, userId, problemId)
      console.log(result)
      return result  
    },
  },
  
}

module.exports = resolvers
