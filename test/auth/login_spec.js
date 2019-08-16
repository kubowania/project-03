/* global api, describe, it, expect, afterEach, beforeEach */
const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const { secret } = require('../../config/environment')

const testData = {
  username: 'testname',
  email: 'testname@test.com',
  password: 'pass',
  passwordConfirmation: 'pass'
}

describe('POST /login', () => {

  beforeEach(done => {
    User.create(testData)
      .then(() => done())
  })

  afterEach(done => {
    User.remove({})
      .then(() => done())
  })

  it('should return a 401 response with bad data', done => {
    api.post('/api/login')
      .send({ email: 'dodgydata@all.wrong', password: 'bad' })
      .end((err, res) => {
        expect(res.status).to.eql(401)
        done()
      })
  })

  it('should return a 200 response with good data', done => {
    api.post('/api/login')
      .send({ email: 'testname@test.com', password: 'pass'})
      .end((err, res) => {
        expect(res.status).to.eq(200)
        done()
      })
  })

  it('should return a valid token', done => {
    api.post('/api/login')
      .send({ email: 'testname@test.com', password: 'pass' })
      .end((err, res) => {
        expect(res.body.token).to.exist

        jwt.verify(res.body.token, secret, (err, payload) => {
          expect(err).to.not.exist
          expect(payload).to.contain.keys([
            'iat',
            'exp',
            'sub'
          ])
        })
        done()
      })
  })
})
