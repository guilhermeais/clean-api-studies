export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API desenvolvida no [curso de NodeJS](https://www.udemy.com/course/tdd-com-mango).',
    version: '1.0.0'
  },
  servers: [
    {
      url: 'http://api.example.com/v1',
      description: 'Optional server description, e.g. Main (production) server'
    },
    {
      url: 'http://staging-api.example.com',
      description: 'Optional server description, e.g. Internal staging server for testing'
    }
  ],
  paths: {
    '/users': {
      get: {
        summary: 'Returns a list of users.',
        description: 'Optional extended description in CommonMark or HTML.',
        responses: {
          200: {
            description: 'A JSON array of user names',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
