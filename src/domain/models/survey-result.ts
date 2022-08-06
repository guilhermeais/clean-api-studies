export type SurveyResultModel = {
  surveyId: string
  question: string
  answers: SurveyResultAnswerModel[]
  date: Date
}

export type SurveyResultAnswerModel = {
  image?: string
  answer: string
  count: number
  percent: number
}
