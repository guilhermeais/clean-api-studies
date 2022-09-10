import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'
import { GraphQLError } from 'graphql'
import resolvers from '../graphql/resolvers'
import typeDefs from '../graphql/type-defs'

function checkError (error: GraphQLError, errorName: string): boolean {
  return (error.name === errorName || error.originalError.name === errorName)
}

function handleErrors (response: any, errors: readonly GraphQLError[]): void {
  errors?.forEach(error => {
    response.data = undefined
    if (checkError(error, 'AuthenticationError')) {
      response.http.status = 401
    } else if (checkError(error, 'ForbiddenError')) {
      response.http.status = 403
    } else {
      response.http.status = 500
    }
  })
}

export function setupApolloServer (app: Express): void {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    plugins: [
      {
        requestDidStart: async ({ request }) => {
          return {
            willSendResponse: async ({ response, errors }) => handleErrors(response, errors)
          }
        }
      }
    ]
  })
  void server.start().then(() => {
    server.applyMiddleware({ app })
  })
}
