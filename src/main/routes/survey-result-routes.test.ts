import request from 'supertest'
import app from '../config/app'

describe('Survey Routes', () => {
  describe('PUT /surveys/:id/results', () => {
    test('Should return 403 on save survey result without access token', async () => {
      await request(app)
        .put('/api/surveys/any_survey_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })
  })
})
