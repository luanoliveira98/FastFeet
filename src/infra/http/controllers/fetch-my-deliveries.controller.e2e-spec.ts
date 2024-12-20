import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { RecipientFactory } from 'test/factories/make-recipient.factory'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person.factory'
import { OrderFactory } from 'test/factories/make-order.factory'

describe('Fetch My Deliveries (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService

  let deliveryPersonFactory: DeliveryPersonFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryPersonFactory, RecipientFactory, OrderFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)

    deliveryPersonFactory = moduleRef.get(DeliveryPersonFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /my-deliveries', async () => {
    const user = await deliveryPersonFactory.makePrismaDeliveryPerson()

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const recipient = await recipientFactory.makePrismaRecipient()

    const otherDeliveryPerson =
      await deliveryPersonFactory.makePrismaDeliveryPerson()

    await Promise.all([
      await orderFactory.makePrismaOrder({
        recipientId: recipient.id,
        deliveryPersonId: user.id,
        status: 'DELIVERED',
      }),
      await orderFactory.makePrismaOrder({
        recipientId: recipient.id,
        deliveryPersonId: otherDeliveryPerson.id,
        status: 'DELIVERED',
      }),
      await orderFactory.makePrismaOrder({
        recipientId: recipient.id,
        deliveryPersonId: user.id,
        status: 'PICKED_UP',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/my-deliveries`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.deliveries).toHaveLength(1)
  })
})
