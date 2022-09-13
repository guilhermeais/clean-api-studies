import { LoadAnswersBySurveyRepository, LoadSurveysRepository, CheckSurveyByIdRepository, AddSurveyRepository, LoadSurveyByIdRepository } from './survey-mongo-repository-protocols'
import { QueryBuilder, MongoHelper } from '@/infra/db/mongodb/helpers'

import { ObjectId } from 'mongodb'
export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository, CheckSurveyByIdRepository, LoadAnswersBySurveyRepository {
  async add (data: AddSurveyRepository.Params): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(data)
  }

  async loadAll (accountId: string): Promise<LoadSurveysRepository.Result> {
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
      const survey = (await surveyCollection.findOne({ _id: new ObjectId(id) }))
      return survey && MongoHelper.map(survey)
    }

    return null
  }

  async loadAnswers (id: string): Promise<LoadAnswersBySurveyRepository.Result> {
    if (id && id.length >= 24) {
      const surveyCollection = await MongoHelper.getCollection('surveys')
      const query = new QueryBuilder()
        .match({
          _id: new ObjectId(id)
        })
        .project({
          _id: 0,
          answers: '$answers.answer'
        })
        .build()

      const surveys = await surveyCollection.aggregate(query).toArray() as any[]
      return surveys[0]?.answers || []
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
      ))

    return survey !== null
  }
}
