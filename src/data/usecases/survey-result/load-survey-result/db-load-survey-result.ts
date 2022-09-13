import {
  LoadSurveyResult,
  LoadSurveyResultRepository,
  LoadSurveyByIdRepository
} from './db-load-survey-result-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) { }

  async load (surveyId: string, accountId: string): Promise<LoadSurveyResult.Result> {
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(
      surveyId,
      accountId
    )

    if (!surveyResult) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId)
      return {
        ...survey,
        surveyId: survey.id,
        question: survey.question,
        date: survey.date,
        answers: survey.answers.map(answer => ({ ...answer, count: 0, percent: 0, isCurrentAccountAnswer: false }))
      }
    }
    return surveyResult
  }
}
