import { DbCheckSurveyById } from '@/data/usecases/survey/check-survey-by-id/db-check-survey-by-id'
import { CheckSurveyById } from '@/domain/usecases/survey'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export function makeDbCheckSurveyById (): CheckSurveyById {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbCheckSurveyById(surveyMongoRepository)
}
