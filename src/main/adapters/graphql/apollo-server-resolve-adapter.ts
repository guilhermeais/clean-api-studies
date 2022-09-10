import { Controller } from '@/presentation/protocols'
import { ApolloError, AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-express'

export async function adaptResolver (controller: Controller, args: any): Promise<any> {
  const httpResponse = await controller.handle(args)
  if (httpResponse.statusCode >= 200 && httpResponse.statusCode < 300) {
    return httpResponse.body
  }

  if (httpResponse.statusCode === 400) {
    throw new UserInputError(httpResponse.body.message)
  }

  if (httpResponse.statusCode === 401) {
    throw new AuthenticationError(httpResponse.body.message)
  }

  if (httpResponse.statusCode === 403) {
    throw new ForbiddenError(httpResponse.body.message)
  }

  throw new ApolloError(httpResponse.body.message)
}
