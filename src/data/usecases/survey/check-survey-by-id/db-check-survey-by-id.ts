import { CheckSurveyById } from '@/domain/usecases/survey'
import { CheckSurveyByIdRepository } from './db-check-survey-by-id-protocols'

export class DbCheckSurveyById implements CheckSurveyById {
  constructor (private readonly checkSurveyByIdRepository: CheckSurveyByIdRepository) {}
  async checkById (id: string): Promise<CheckSurveyById.Result> {
    return await this.checkSurveyByIdRepository.checkById(id)
  }
}
