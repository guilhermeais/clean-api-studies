import { SurveyModel } from '../../models/survey'

export interface LoadSurveyById {
  loadById: (surveyId: string) => Promise<LoadSurveyById.Result>
}

export namespace LoadSurveyById {
  export type Result = SurveyModel
}
