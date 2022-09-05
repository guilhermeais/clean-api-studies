import { mockSurvey, mockSurveys } from '@/domain/test'
import { CheckSurveyById } from '../controllers/survey-result/load-survey-result/load-survey-result-controller-protocols'
import { LoadSurveyById } from '../controllers/survey-result/save-survey-result/save-survey-result-controller-protocols'
import {
  AddSurvey
} from '../controllers/survey/add-survey/add-survey-controller-protocols'
import {
  LoadSurveys,
  SurveyModel
} from '../controllers/survey/load-survey/load-surveys-controller-protocols'

export class AddSurveySpy implements AddSurvey {
  addSurveyParams: AddSurvey.Params
  async add (data: AddSurvey.Params): Promise<void> {
    this.addSurveyParams = data
    await Promise.resolve()
  }
}
export class LoadSurveysSpy implements LoadSurveys {
  surveys = mockSurveys()
  accountId: string
  async load (accountId?: string): Promise<SurveyModel[]> {
    this.accountId = accountId
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

export class CheckSurveyByIdSpy implements CheckSurveyById {
  surveyId: string
  result = true
  async checkById (surveyId: string): Promise<CheckSurveyById.Result> {
    this.surveyId = surveyId
    return await Promise.resolve(this.result)
  }
}
