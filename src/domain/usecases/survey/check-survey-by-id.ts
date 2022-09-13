export interface CheckSurveyById {
  checkById: (surveyId: string) => Promise<CheckSurveyById.Result>
}

export namespace CheckSurveyById {
  export type Result = boolean
}
