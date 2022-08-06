export const surveyResultSchema = {
  type: 'object',
  properties: {
    question: { type: 'string' },
    surveyId: { type: 'string' },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyResultAnswer'
      }
    },
    date: {
      type: 'string'
    }
  },
  required: ['surveyId', 'question', 'answers', 'date']
}
