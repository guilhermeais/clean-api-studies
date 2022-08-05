import { components } from './components'
import { paths } from './paths'
import { schemas } from './schemas'

export const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description:
      'API desenvolvida no [curso de NodeJS](https://www.udemy.com/course/tdd-com-mango).',
    version: '1.0.0'
  },
  license: {
    name: 'ISC',
    url: 'https://opensource.org/licenses/ISC'
  },
  servers: [
    {
      url: '/api'
    }
  ],
  tags: [
    {
      name: 'Login'
    },
    {
      name: 'Enquete'
    }
  ],
  paths,
  schemas,
  components
}
