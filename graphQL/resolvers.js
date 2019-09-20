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
    getAllCompanyQueue:  async (_,{token, companyId}, { dataSources }) => {
    const result = await dataSources.queueAPI.getAllCompanyQueue(token, companyId)
    return result
  },
  },
  
}

module.exports = resolvers
