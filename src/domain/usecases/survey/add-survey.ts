import { SurveyAnswerModel } from '../../models/survey'

export type AddSurveyParams = {
  question: string
  answers: SurveyAnswerModel[]
  date: Date
}

export interface AddSurvey {
  add: (data: AddSurveyParams) => Promise<void>
}
