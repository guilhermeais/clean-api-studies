import { mockSurvey, mockSurveys } from '@/domain/test'
import { LoadSurveyById } from '../controllers/survey-result/save-survey-result/save-survey-result-controller-protocols'
import { AddSurvey, AddSurveyParams } from '../controllers/survey/add-survey/add-survey-controller-protocols'
import { LoadSurveys, SurveyModel } from '../controllers/survey/load-survey/load-surveys-controller-protocols'

export function mockAddSurvey (): AddSurvey {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyParams): Promise<void> {
      await Promise.resolve()
    }
  }

  return new AddSurveyStub()
}

export function mockLoadSurveys (): LoadSurveys {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return await Promise.resolve(mockSurveys())
    }
  }
  return new LoadSurveysStub()
}

export function mockLoadSurveyById (): LoadSurveyById {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (): Promise<SurveyModel> {
      return await Promise.resolve(mockSurvey())
    }
  }

  return new LoadSurveyByIdStub()
}
