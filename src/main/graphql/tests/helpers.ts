import { ApolloServer } from 'apollo-server-express'
import schemaDirectives from '../directives'
import resolvers from '../resolvers'
import typeDefs from '../type-defs'

export function makeApolloServer (): ApolloServer {
  return new ApolloServer({
    resolvers,
    typeDefs,
    schemaDirectives,
    context: ({ req }) => ({ req })
  })
}
