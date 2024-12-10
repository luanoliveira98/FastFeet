import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin.factory'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Authenticate (E2E)', () => {
  let app: INestApplication

  let adminFactory: AdminFactory

  beforeAll(async () => {
    const moduleRed = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile()

    app = moduleRed.createNestApplication()

    adminFactory = moduleRed.get(AdminFactory)

    await app.init()
  })

  test('[POST] /sessions', async () => {
    const cpf = '12345678910'
    const password = '123456'

    await adminFactory.makePrismaAdmin({
      cpf,
      password: await hash(password, 8),
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      cpf,
      password,
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
