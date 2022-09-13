import { makeAuthMiddleware } from '@/main/factories/middlewares/auth-middleware-factory'
import { ApolloError, ForbiddenError, SchemaDirectiveVisitor } from 'apollo-server-express'
import { GraphQLField, defaultFieldResolver } from 'graphql'

export class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition (field: GraphQLField<any, any>): any {
    const { resolve = defaultFieldResolver } = field
    field.resolve = async (parent, args, context, info) => {
      const httpRequest: any = {
        accessToken: context?.req.headers?.['x-access-token']
      }

      try {
        const request = await makeAuthMiddleware().handle(httpRequest)
        if (request.statusCode >= 200 && request.statusCode <= 299) {
          Object.assign(context?.req, request.body)
          return resolve.call(this, parent, args, context, info)
        } else {
          throw new ForbiddenError(request.body.message)
        }
      } catch (error) {
        throw new ApolloError(error.message)
      }
    }
  }
}
