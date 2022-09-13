export interface LoadAnswersBySurvey {
  loadAnswers: (surveyId: string) => Promise<LoadAnswersBySurvey.Result>
}

export namespace LoadAnswersBySurvey {
  export type Result = String[]
}
