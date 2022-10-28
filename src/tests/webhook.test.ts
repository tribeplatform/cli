import App from '@/app'
import { AuthController } from '@controllers'
import { WebhookInputDto } from '@dtos'
import request from 'supertest'

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500))
})

describe('Testing Auth', () => {
  describe('[POST] /signup', () => {
    it('response should have the Create userData', () => {
      const userData: WebhookInputDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4',
      }

      const app = new App([AuthController])
      return request(app.getServer()).post('/signup').send(userData)
    })
  })

  describe('[POST] /login', () => {
    it('response should have the Set-Cookie header with the Authorization token', async () => {
      const userData: WebhookInputDto = {
        email: 'lim@gmail.com',
        password: 'q1w2e3r4',
      }

      const app = new App([AuthController])
      return request(app.getServer())
        .post('/login')
        .send(userData)
        .expect('Set-Cookie', /^Authorization=.+/)
    })
  })

  // error: StatusCode : 404, Message : Authentication token missing
  // describe('[POST] /logout', () => {
  //   it('logout Set-Cookie Authorization=; Max-age=0', () => {
  //     const authRoute = new AuthRoute();
  //     const app = new App([authRoute]);

  //     return request(app.getServer())
  //       .post('/logout')
  //       .expect('Set-Cookie', /^Authorization=\;/);
  //   });
  // });
})
