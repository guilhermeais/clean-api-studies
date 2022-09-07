export interface LoadAnswersBySurveyRepository {
  loadAnswers: (id: LoadAnswersBySurveyRepository.Params) => Promise<LoadAnswersBySurveyRepository.Result>
}

export namespace LoadAnswersBySurveyRepository {
  export type Result = string[]
  export type Params = string
}
