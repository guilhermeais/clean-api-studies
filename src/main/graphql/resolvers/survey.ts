import { adaptResolver } from '@/main/adapters/graphql/apollo-server-resolve-adapter'
import { makeLoadSurveysController } from '@/main/factories/controllers/survey/load-surveys/load-surveys-controller-factory'

export default {
  Query: {
    async surveys () {
      return await adaptResolver(makeLoadSurveysController())
    }
  }
}
