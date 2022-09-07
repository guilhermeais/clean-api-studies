import { CheckSurveyByIdRepository } from '@/data/protocols/db/survey'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { AddSurveyRepository } from '@/data/usecases/survey/add-survey/db-add-survey-protocols'
import { LoadSurveyByIdRepository } from '@/data/usecases/survey/load-answers-by-survey/db-load-answers-by-survey-protocols'
import { SurveyModel } from '@/domain/models/survey'
import { ObjectId } from 'mongodb'
import { QueryBuilder } from '../helpers'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository, CheckSurveyByIdRepository {
  async add (data: AddSurveyRepository.Params): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(data)
  }

  async loadAll (accountId: string): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')

    const query = new QueryBuilder()
      .lookup({
        from: 'surveyResults',
        localField: '_id',
        foreignField: 'surveyId',
        as: 'result'
      })
      .project({
        question: 1,
        answers: 1,
        date: 1,
        didAnswer: {
          $gte: [
            {
              $size: {
                $filter: {
                  input: '$result',
                  as: 'item',
                  cond: { $eq: ['$$item.accountId', new ObjectId(accountId)] }
                }
              }
            },
            1
          ]

        }
      })
      .build()

    const surveys = await surveyCollection.aggregate(query).toArray() as []
    return MongoHelper.mapCollection(surveys)
  }

  async loadById (id: string): Promise<LoadSurveyByIdRepository.Result> {
    if (id && id.length >= 24) {
      const surveyCollection = await MongoHelper.getCollection('surveys')
      const survey = (await surveyCollection.findOne({ _id: new ObjectId(id) }) as unknown) as SurveyModel
      return survey && MongoHelper.map(survey)
    }

    return null
  }

  async checkById (id: string): Promise<CheckSurveyByIdRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = (await surveyCollection
      .findOne(
        { _id: new ObjectId(id) }, {
          projection: {
            _id: 1
          }
        }
      ) as unknown) as SurveyModel
    return survey !== null
  }
}
