const app = require('../index')
const supertest = require('supertest')

const request = supertest(app)

it('', async done => {
  // Sends GET Request to /test endpoint
  const res = await request
    .post('/api/auth/login')
    .send({
      login: 'TestLogin',
      password: 'TestPassword',
    })
  expect(res.status).toBe(200)
  // expect(res.body.message).toBe('pass!')
  done()
})