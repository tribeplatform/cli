import App from '@/app'
import { IndexController } from '@controllers'
import request from 'supertest'

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500))
})

describe('Testing Index', () => {
  describe('[GET] /', () => {
    it('response statusCode 200', () => {
      const app = new App([IndexController])

      return request(app.getServer()).get('/').expect(200)
    })
  })
})
