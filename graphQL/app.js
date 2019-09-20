const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')
const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 4000

app.use(cors())
const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.applyMiddleware({app, path: '/graphql'})

app.listen(PORT, () => console.log(`Apollo Server Running On Port ${PORT}`))