import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'
import resolvers from '../graphql/resolvers'
import typeDefs from '../graphql/type-defs'

export function setupApolloServer (app: Express): void {
  const server = new ApolloServer({
    resolvers,
    typeDefs
  })
  void server.start().then(() => {
    server.applyMiddleware({ app })
  })
}
