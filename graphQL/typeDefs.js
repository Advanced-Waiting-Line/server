const { gql } = require('apollo-server-express')

const typeDefs = gql`
  scalar Date
  type MyType {
   created: Date
  }
  type Query {
    company (id: String): Company,
    user (id: String): User
    queueLog: QueueLog
  }
  type Company {
    ${'_id'}: String,
    openTime : String,
    closeTime: String,
    location: String,
    email: String,
    password: String,
    queue: [String]
  },
  type User {
    ${'_id'}: String,
    firstName: String,
    lastName: String,
    image: String,
    email: String,
    password: String,
    location: String
  },
  type Notification {
    token: String,
    ${'_id'}: String,
    email: String,
    n: Int,
    nModified: Int,
    ok: Int,
  },
  type QueueLog{
    _id: String,
    companyId: String,
    userId: String,
    problem: String,
    duration: Int,
    checkIn: String,
  },
  ,
  type Mutation {
    registerCompany(
      openTime: String,
      closeTime: String,
      location: String,
      image: String,
      email: String,
      password: String,
    ): Company,
    loginCompany(
      email: String,
      password: String,
    ): Notification,
    clearQueueCompany(
      companyId: String
    ):Notification,
    registerUser(
      firstName: String,
      lastName: String,
      image: String,
      email: String,
      password: String,
      location: String
    ): User,
    loginUser(
      email: String,
      password: String
    ): Notification,
    updateUser(
      userId: String,
      firstName: String,
      lastName: String,
      image: String,
      email: String,
      password: String,
      location: String
    ): Notification,
    deleteUser(
      userId: String,
    ): Notification,
    getAllCompanyQueue(
      token: String, 
      companyId: String)
    : [QueueLog],
    getTodayLog(
      token: String, 
      companyId: String)
    : [QueueLog],
    getOneDayLog(
      token: String, 
      companyId: String,
      date: Int,
      month: Int,
      year: Int)
    : [QueueLog],  
    createQueue(
      token: String, 
      companyId: String,
      userId:String,
      problemId: String,)
    :QueueLog
  },
  

`

module.exports = typeDefs