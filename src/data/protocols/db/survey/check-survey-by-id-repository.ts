export interface CheckSurveyByIdRepository {
  checkById: (id: CheckSurveyByIdRepository.Params) => Promise<CheckSurveyByIdRepository.Result>
}

export namespace CheckSurveyByIdRepository {
  export type Result = boolean
  export type Params = string
}
