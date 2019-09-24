const { gql } = require('apollo-server-express')

const typeDefs = gql`
  scalar Date
  type MyType {
   created: Date
  }
  type Query {
    company (id: String): Company
    user (id: String): User
    queueLog: QueueLog
    getAllCompanyQueue(
      token: String)
    : [QueueLog]
    getTodayLog(
      token: String)
    : [QueueLog]
    getOneDayLog(
      token: String
      date: Int
      month: Int
      year: Int)
    : [QueueLog]  
    getCompanyProblem(
      companyId: String
    )
    :[Problem]
    getQueueByUserId(
      token: String
    ): [QueueLog]
    getAllCompany: [Company]
    findOneUser(
      userId: String
    ): User
  }
  type Company {
    _id: String
    openTime : String,
    closeTime: String,
    image: String,
    location: Location,
    email: String,
    password: String,
    queue: [String]
  }

  type User {
    _id: String
    firstName: String
    lastName: String
    image: String
    email: String
    password: String
    location: Location
  }

  type Notification {
    token: String
    _id: String
    email: String
    n: Int
    nModified: Int
    ok: Int
  }
  
  type QueueLog{
    _id: String
    companyId: Company
    userId: User
    problem: Problem
    duration: Int
    checkIn: String
    status: Boolean
  }
  type UpdateResult{
    message: String
  }
  
  type Problem{
    _id: String
    name: String
    duration: Int
    description: String
  },
  type Location {
    lat: Float,
    lng: Float
  },
  input InputLocation {
    lat: Float,
    lng: Float
  },

  type Mutation {
    registerCompany(
      openTime: String,
      closeTime: String,
      location: InputLocation,
      image: String,
      email: String,
      password: String,
    ): Company,
    loginCompany(
      email: String
      password: String
    ): Notification
    clearQueueCompany(
      companyId: String
    ):Notification
    registerUser(
      firstName: String
      lastName: String
      image: String
      email: String
      password: String
      location: InputLocation
    ): User
    loginUser(
      email: String
      password: String
    ): Notification
    updateUser(
      userId: String
      firstName: String
      lastName: String
      image: String
      email: String
      password: String
      location: InputLocation
    ): Notification
    deleteUser(
      userId: String
    ): Notification
   #queue
    createQueue(
      token: String 
      companyId: String
      problemId: String)
    :QueueLog
    updateDurationQueue(
      token: String
      queueId: String
      duration: Int
    ):UpdateResult
    removeFromQueue(
      token: String
      queueId:String
    ):UpdateResult
    updateStatus(
      token:String
      queueId:String
    ):UpdateResult
  #problem
    
    createProblem(
      token: String
      name: String
      description: String
      duration: Int
    ):Problem
    deleteProblem(
      token: String
      problemId: String
    ):Problem
    updateProblem(
      token: String
      problemId: String
      name: String
      duration: Int
    ):Problem
  }  
`

module.exports = typeDefs