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
    getCompanyProblem(
      companyId: String
    )
    :[Problem],
  }
  type Company {
    ${'_id'}: String,
    openTime : String,
    closeTime: String,
    image: String,
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
    companyId: Company,
    userId: User,
    problem: Problem,
    duration: Int,
    checkIn: String,
  },
  type Problem{
    _id: String,
    companyId: Company,
    name: String,
    duration: Int
  }
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
   #queue
    createQueue(
      token: String, 
      companyId: String,
      userId:String,
      problemId: String,)
    :QueueLog,
  #problem
    
    createProblem(
      token: String,
      name: String,
      duration: Int
    ):Problem
    deleteProblem(
      token: String,
      problemId: String
    ):Problem
    updateProblem(
      token: String,
      problemId: String,
      name: String,
      duration: Int
    ):Problem
  },
  

`

module.exports = typeDefs