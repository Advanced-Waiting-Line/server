const axios = require('axios')
const awanUrl = 'http://localhost:3000'
const FormData = require('form-data')

const resolvers = {
  Query: {
    getAllCompanyQueue:  async (_,{token}, { dataSources }) => {
      const result = await dataSources.queueAPI.getAllCompanyQueue(token)
      return result  
    },
    getTodayLog: async (_, {token}, {dataSources}) => {
      const result = await dataSources.queueAPI.getTodayLog(token)
      console.log(result)
      return result  
    },
    getOneDayLog: async (_, {token, date, month, year}, {dataSources}) => {
      const result = await dataSources.queueAPI.getOneDayLog(token, date, month, year)
      return result  
    },
    getQueueByUserId: async (_, {token}, {dataSources}) => {
      const result = await dataSources.queueAPI.getQueueByUserId(token)
      return result  
    },
    getCompanyProblem: async (_,{companyId}, { dataSources }) => {
      const result = await dataSources.problemAPI.getCompanyProblem(companyId)
      return result  
    },
    getAllCompany: async (_,{}, { dataSources }) => {
      const result = await dataSources.companyAPI.getAllCompany()
      return result
    },
    findOneUser: async (_,{userId}, { dataSources }) => {
      const result = await dataSources.userAPI.findOneUser(userId)
      return result
    },
    findCompanyById: async (_,{companyId}, { dataSources }) => {
      const result = await dataSources.companyAPI.findCompanyById(companyId)
      return result
    },

  },
  Mutation: {
    registerCompany: async (parent, { name, address, openTime, closeTime, image, location, email, password }, context, info) => {      
      let input = {}
      name && (input.name = name)
      address && (input.address = address)
      openTime && (input.openTime = openTime)
      closeTime && (input.closeTime = closeTime)
      image && (input.image = image)
      location && (input.location = location)
      email && (input.email = email)
      password && (input.password = password)

      const { data } = await 
        axios({
          url: `${awanUrl}/companies/register`,
          method: `post`,
          data: input
        })
      return data

    },
    loginCompany: async (parent, { email, password }, context, info) => {
      let input = {}
      email && (input.email = email)
      password && (input.password = password)
      
      const { data } = await axios.post(`${awanUrl}/companies/login`, input)
      return data
    },
    clearQueueCompany : async (parent, { companyId }, context, info) => {
      const { data } = await axios.post(`${awanUrl}/companies/clearQueue/${companyId}`)
      return data
    },
    registerUser: async (parent, { firstName, lastName, image, email, password, location }, context, info) => {
      let input = {}
      firstName && (input.firstName = firstName)
      lastName && (input.lastName = lastName)
      image && (input.image = image)
      email && (input.email = email)
      password && (input.password = password)
      location && (input.location = location)
      const { data } = await axios.post(`${awanUrl}/users/register`, input)
      return data
    },
    loginUser: async (parent, { email, password }, context, info) => {
      let input = {}
      email && (input.email = email)
      password && (input.password = password)
      const { data } = await axios.post(`${awanUrl}/users/login`, input)
      return data
    },
    updateUser: async (parent, { userId, firstName, lastName, image, email, password, location }, context, info) => {
      let input = {}
      firstName && (input.firstName = firstName)
      lastName && (input.lastName = lastName)
      image && (input.image = image)
      email && (input.email = email)
      password && (input.password = password)
      location && (input.location = location)

      const { data } = await axios.patch(`${awanUrl}/users/update/${userId}`, input)
      return data
    },
    deleteUser: async (parent, { userId }, context, info) => {
      const { data } = await axios.delete(`${awanUrl}/users/delete/${userId}`)
      return data
    },
    
    createQueue: async (_, {token, companyId, problemId}, {dataSources}) => {
      const result = await dataSources.queueAPI.createQueue(token, companyId, problemId)
      return result  
    },

    updateDurationQueue: async (_, {token, queueId, duration}, {dataSources}) => {
      const result = await dataSources.queueAPI.updateDurationQueue(token, queueId, duration)
      return result  
    },

    removeFromQueue:  async (_, {token, queueId}, {dataSources}) => {
      const result = await dataSources.queueAPI.removeFromQueue(token, queueId)
      return result  
    },

    updateStatus: async (_, {token, queueId}, {dataSources}) => {
      const result = await dataSources.queueAPI.updateStatus(token, queueId)
      return result  
    },

    //problem
    
    createProblem: async (_,{token, name, duration, description}, { dataSources }) => {
      const result = await dataSources.problemAPI.createProblem(token, name, duration, description)
      console.log(result)
      return result  
    },
    deleteProblem: async (_,{token, problemId}, { dataSources }) => {
      const result = await dataSources.problemAPI.deleteProblem(token,problemId)
      return result
    },
    updateProblem: async(_,{token, problemId, name, duration}, {dataSources}) => {
      const result = await dataSources.problemAPI.updateProblem(token, problemId, name, duration)
      console.log(result)
      return result
    }
  },
  
}

module.exports = resolvers
