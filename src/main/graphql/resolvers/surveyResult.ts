import { adaptResolver } from '@/main/adapters/graphql/apollo-server-resolve-adapter'
import { makeLoadSurveyResultController } from '@/main/factories/controllers/survey-result/save-survey-result/load-survey-result-controller-factory'
import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory'

export default {
  Query: {
    async surveyResult (parent: any, args: any) {
      return await adaptResolver(makeLoadSurveyResultController(), args)
    }
  },
  Mutation: {
    async saveSurveyResult (parent: any, args: any) {
      return await adaptResolver(makeSaveSurveyResultController(), args)
    }
  }
}
