import { mockSurvey, mockSurveys } from '@/domain/test'
import { LoadSurveyById } from '../controllers/survey-result/save-survey-result/save-survey-result-controller-protocols'
import {
  AddSurvey,
  AddSurveyParams
} from '../controllers/survey/add-survey/add-survey-controller-protocols'
import {
  LoadSurveys,
  SurveyModel
} from '../controllers/survey/load-survey/load-surveys-controller-protocols'

export class AddSurveySpy implements AddSurvey {
  addSurveyParams: AddSurveyParams
  async add (data: AddSurveyParams): Promise<void> {
    this.addSurveyParams = data
    await Promise.resolve()
  }
}
export class LoadSurveysSpy implements LoadSurveys {
  surveys = mockSurveys()
  async load (): Promise<SurveyModel[]> {
    return await Promise.resolve(this.surveys)
  }
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
  surveyId: string
  survey = mockSurvey()
  async loadById (surveyId: string): Promise<SurveyModel> {
    this.surveyId = surveyId
    return await Promise.resolve(this.survey)
  }
}
