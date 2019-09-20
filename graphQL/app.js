const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')
const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 4000

const QueueAPI = require('./datasource/queue')

app.use(cors())
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
  queueAPI: new QueueAPI()
}),
})

server.applyMiddleware({app, path: '/graphql'})

app.listen(PORT, () => console.log(`Apollo Server Running On Port ${PORT}`))