
import {
  accountSchema,
  errorSchema,
  loginParamsSchema,
  surveySchema,
  surveysSchema,
  surveyAnswerSchema,
  signupParamsSchema,
  addSurveyParamsSchema,
  saveSurveyParamsSchema,
  surveyResultSchema
} from './schemas/'

export const schemas = {
  account: accountSchema,
  signupParams: signupParamsSchema,
  loginParams: loginParamsSchema,
  addSurveyParams: addSurveyParamsSchema,
  error: errorSchema,
  surveys: surveysSchema,
  survey: surveySchema,
  surveyAnswer: surveyAnswerSchema,
  saveSurveyParams: saveSurveyParamsSchema,
  surveyResult: surveyResultSchema
}
