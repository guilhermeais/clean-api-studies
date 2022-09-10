import { adaptResolver } from '@/main/adapters/graphql/apollo-server-resolve-adapter'
import { makeLoginController } from '@/main/factories/controllers/login/login/login-controller-factory'
import { makeSignUpController } from '@/main/factories/controllers/login/signup/signup-controller-factory'

export default {
  Query: {
    async login (parent: any, args: any) {
      return await adaptResolver(makeLoginController(), args)
    }
  },
  Mutation: {
    async signUp (parent: any, args: any) {
      return await adaptResolver(makeSignUpController(), args)
    }
  }
}
