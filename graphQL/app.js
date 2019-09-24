const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')
const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 4000

const QueueAPI = require('./datasource/queue')
const ProblemAPI = require('./datasource/problem')
const CompanyAPI = require('./datasource/company')
const UserAPI = require('./datasource/user')

app.use(cors())
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
  queueAPI: new QueueAPI(),
  problemAPI: new ProblemAPI(),
  companyAPI: new CompanyAPI(),
  userAPI: new UserAPI()
}),
})

server.applyMiddleware({app, path: '/graphql', bodyParserConfig: {limit: "5mb"}})

app.listen(PORT, () => console.log(`Apollo Server Running On Port ${PORT}`))