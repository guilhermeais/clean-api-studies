import { SurveyModel } from '../../models/survey'
export interface LoadSurveys {
  load: (accountId: string) => Promise<SurveyModel[]>
}
