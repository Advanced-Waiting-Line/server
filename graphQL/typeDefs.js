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
  type Login {
    token: String,
    ${'_id'}: String,
    email: String,
  },
  type QueueLog{
    _id: String,
    companyId: String,
    userId: String,
    problem: String,
    duration: Int,
    checkIn: String,
  },
  type Problem{
    _id: String,
    companyId: String,
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
    ): Login,
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
    ): Login,
  # queue
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
    :QueueLog,
  #problem
    getCompanyProblem(
      companyId: String
    )
    :[Problem],
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