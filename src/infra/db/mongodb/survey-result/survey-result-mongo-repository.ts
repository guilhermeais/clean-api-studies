import { MongoHelper } from '../helpers/mongo-helper'
import {
  SaveSurveyResultRepository,
  SaveSurveyResultModel,
  SurveyResultModel
} from './survey-result-mongo-repository-protocols'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyCollection = await MongoHelper.getCollection('surveyResults')
    await surveyCollection.findOneAndUpdate(
      { surveyId: data.surveyId, accountId: data.accountId },
      {
        $set: {
          answer: data.answer,
          date: data.date
        }
      },
      {
        upsert: true
      }
    )
    const survey = await surveyCollection.findOne({ accountId: data.accountId, surveyId: data.surveyId })
    return survey && MongoHelper.map(survey)
  }
}
