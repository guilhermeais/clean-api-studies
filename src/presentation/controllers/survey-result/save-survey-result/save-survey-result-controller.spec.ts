import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { SaveSurveyResultController } from './save-survey-result-controller'
import {
  HttpRequest,
  LoadSurveyById,
  SurveyModel,
  SaveSurveyResult,
  SurveyResultModel,
  SaveSurveyResultModel
} from './save-survey-result-controller-protocols'
import MockDate from 'mockdate'

function makeFakeRequest (): HttpRequest {
  return {
    body: {
      answer: 'any_answer'
    },
    params: {
      surveyId: 'any_survey_id'
    },
    accountId: 'any_account_id'
  }
}

function makeSurvey (): SurveyModel {
  return {
    id: 'any_survey_id',
    question: 'any_question',
    answers: [
      {
        answer: 'any_answer',
        image: 'any_image'
      },
      {
        answer: 'any_other_answer'
      }
    ],
    date: new Date()
  }
}

function makeLoadSurveyById (): LoadSurveyById {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (): Promise<SurveyModel> {
      return await Promise.resolve(makeSurvey())
    }
  }

  return new LoadSurveyByIdStub()
}

function makeSaveSurveyResultModel (): SurveyResultModel {
  return {
    id: 'any_id',
    surveyId: 'any_survey_id',
    accountId: 'any_account_id',
    answer: 'any_answer',
    date: new Date()
  }
}

function makeSaveSurveyResult (): SaveSurveyResult {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return await Promise.resolve(makeSaveSurveyResultModel())
    }
  }

  return new SaveSurveyResultStub()
}

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

function makeSut (): SutTypes {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const saveSurveyResultStub = makeSaveSurveyResult()
  const sut = new SaveSurveyResultController(
    loadSurveyByIdStub,
    saveSurveyResultStub
  )

  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub
  }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveyById with correct survey id', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById')
    const fakeRequest = makeFakeRequest()
    await sut.handle(fakeRequest)

    expect(loadSurveyByIdStub.loadById).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null)
    const fakeRequest = makeFakeRequest()
    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const errorMock = new Error('some_error')
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockRejectedValueOnce(errorMock)
    const httpRequest = {}
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(errorMock))
  })

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      body: {
        answer: 'invalid_answer'
      },
      params: {
        surveyId: 'any_survey_id'
      }
    })

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save')
    const fakeRequest = makeFakeRequest()
    await sut.handle(fakeRequest)

    expect(saveSurveyResultStub.save).toHaveBeenCalledWith({
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      answer: 'any_answer',
      date: new Date()
    })
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const errorMock = new Error('some_error')
    jest.spyOn(saveSurveyResultStub, 'save').mockRejectedValueOnce(errorMock)
    const httpRequest = {}
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(errorMock))
  })
})
