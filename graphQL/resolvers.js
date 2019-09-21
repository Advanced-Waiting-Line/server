const axios = require('axios')
const awanUrl = 'http://localhost:3000'
const FormData = require('form-data')

const resolvers = {
  Query: {
  },
  Mutation: {
    registerCompany: async (parent, { openTime, closeTime, image, location, email, password }, context, info) => {
      // console.log(openTime, closeTime, location, email, password, image)
      
      // ======== Tanya Instructur cara form data ========
      // const formData = new FormData()
      // formData.append('openTime', openTime)
      // openTime ? formData.append('openTime', openTime) : console.log('gak masuk')
      // closeTime ? formData.append('closeTime', closeTime) : console.log('gak masuk')
      // location ? formData.append('location', location) : console.log('gak masuk')
      // email ? formData.append('email', email) : console.log('gak masuk')
      // password ? formData.append('password', password) : console.log('gak masuk')
      // if (image){
      //   formData.append('file', Buffer.from(image, 'base64'), 'companyImage.jpeg')
      // }
      
      let input = {}
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
          data: input,
          // headers: {
          //   "Content_type": `multipart/form-data; boundary=${formData._boundary}`
          // }
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
    registerUser: async (parent, { firstName, lastName, image, email, password, location }, context, info) => {
      // if (image){
      //   formData.append('file', Buffer.from(image, 'base64'), 'companyImage.jpeg')
      // }
      console.log('masuk siniii')
      console.log({ firstName, lastName, image, email, password, location })
      let input = {}
      firstName && (input.firstName = firstName)
      lastName && (input.lastName = lastName)
      image && (input.image = image)
      email && (input.email = email)
      password && (input.password = password)
      location && (input.location = location)

      const { data } = await axios.post(`${awanUrl}/users/register`, input, {
        // headers: {
        //   "Content_type": `multipart/form-data; boundary=${formData._boundary}`
        // }
      })
      return data
    },
    loginUser: async (parent, { email, password }, context, info) => {
      let input = {}
      email && (input.email = email)
      password && (input.password = password)
      const { data } = await axios.post(`${awanUrl}/users/login`, input)
      return data
    },

    //queue
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
      return result  
    },

    //problem
    getCompanyProblem: async (_,{companyId}, { dataSources }) => {
      const result = await dataSources.problemAPI.getCompanyProblem(companyId)
      console.log(result)
      return result  
    },
    createProblem: async (_,{token, name, duration}, { dataSources }) => {
      const result = await dataSources.problemAPI.createProblem(token, name, duration)
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
