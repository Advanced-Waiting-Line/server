const { gql } = require('apollo-server-express')

const typeDefs = gql`
  type Query {
    company (id: String): Company,
    user (id: String): User
  }
  type Company {
    ${'_id'}: String,
    openTime : String,
    closeTime: String,
    location: String,
    email: Int,
    password: [String],
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
  type Mutation {
    registerCompany(
      openTime: String,
      closeTime: String,
      location: String,
      email: String,
      password: String,
    ): Company,
    loginCompany(
      openTime : String,
      closeTime: String,
      location: String,
      image: String,
      email: Int,
      password: [String],
      queue: [String]
    ): Company,
    registerUser(
      openTime : String,
      closeTime: String,
      location: String,
      email: Int,
      password: [String],
      queue: [String]
    ): User,
    loginUser(
      openTime : String,
      closeTime: String,
      location: String,
      email: Int,
      password: [String],
      queue: [String]
    ): User,
  }
`

module.exports = typeDefs