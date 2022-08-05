import { loginPath, signupPath, surveyPath, surveyResultPath } from './paths/'

export const paths = {
  '/login': loginPath,
  '/surveys': surveyPath,
  '/signup': signupPath,
  '/surveys/{surveyId}/results': surveyResultPath

}
