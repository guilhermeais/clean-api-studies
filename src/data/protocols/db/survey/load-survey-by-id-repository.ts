import { SurveyModel } from '@/domain/models/survey'

export interface LoadSurveyByIdRepository {
  loadById: (id: LoadSurveyByIdRepository.Params) => Promise<LoadSurveyByIdRepository.Result>
}

export namespace LoadSurveyByIdRepository {
  export type Result = SurveyModel
  export type Params = string
}
