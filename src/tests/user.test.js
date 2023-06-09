const supertest = require('supertest')
const { app } = require('../index')
const api = supertest(app)
const API_URL = '/api/users'

describe('User', () => {
  test('a valid user can be added', () => {
    const user = {
      email: 'jfloresxc@gmail.com',
      username: 'jfloresxc',
      password: 'jfloresxc',
    }

    api
      .post(`${API_URL}`)
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})
