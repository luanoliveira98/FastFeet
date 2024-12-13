import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { OrderFactory } from 'test/factories/make-order.factory'
import { RecipientFactory } from 'test/factories/make-recipient.factory'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person.factory'

describe('Get Order By Id (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService

  let deliveryPersonFactory: DeliveryPersonFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryPersonFactory, OrderFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)

    deliveryPersonFactory = moduleRef.get(DeliveryPersonFactory)
    orderFactory = moduleRef.get(OrderFactory)
    recipientFactory = moduleRef.get(RecipientFactory)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /orders/:id', async () => {
    const user = await deliveryPersonFactory.makePrismaDeliveryPerson()

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const recipient = await recipientFactory.makePrismaRecipient()

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    })

    const orderId = order.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      order: expect.objectContaining({
        orderId,
      }),
    })
  })
})
