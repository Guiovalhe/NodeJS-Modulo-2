// Description: Example test file.
import { test, beforeAll, afterAll, describe, it, expect, beforeEach } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
import request from 'supertest'


describe('Transaction routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback')
    execSync('npm run knex migrate:latest')
  })

  it('User can create a new transaction', async () => {
    const response = await request(app.server)
      .post('/transactions')
      .send({
        title: `New transaction`,
        amount: 5000,
        type: 'credit',
      }).expect(201)
  })

  it('Should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: `New transaction`,
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')!

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: `New transaction`,
        amount: 5000,
      }),
    ])
  })
})




