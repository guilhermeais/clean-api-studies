import { SurveyModel } from '../models/survey'

export interface LoadSurveyById {
  loadById: (surveyId: string) => Promise<SurveyModel>
}
