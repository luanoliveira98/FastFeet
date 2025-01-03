import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin.factory'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person.factory'

describe('Get Account By Id (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService

  let adminFactory: AdminFactory
  let deliveryPersonFactory: DeliveryPersonFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, DeliveryPersonFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)

    adminFactory = moduleRef.get(AdminFactory)
    deliveryPersonFactory = moduleRef.get(DeliveryPersonFactory)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /accounts/:id', async () => {
    const user = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const deliveryPerson =
      await deliveryPersonFactory.makePrismaDeliveryPerson()

    const deliveryPersonId = deliveryPerson.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/accounts/${deliveryPersonId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      account: {
        deliveryPersonId: deliveryPerson.id.toString(),
        cpf: deliveryPerson.cpf,
        name: deliveryPerson.name,
      },
    })
  })
})
