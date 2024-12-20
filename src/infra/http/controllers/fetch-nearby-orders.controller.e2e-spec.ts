import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { RecipientFactory } from 'test/factories/make-recipient.factory'
import { AddressFactory } from 'test/factories/make-address.factory'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person.factory'
import { OrderFactory } from 'test/factories/make-order.factory'

describe('Fetch Nearby Orders (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService

  let deliveryPersonFactory: DeliveryPersonFactory
  let recipientFactory: RecipientFactory
  let addressFactory: AddressFactory
  let orderFactory: OrderFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        DeliveryPersonFactory,
        RecipientFactory,
        AddressFactory,
        OrderFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)

    deliveryPersonFactory = moduleRef.get(DeliveryPersonFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    addressFactory = moduleRef.get(AddressFactory)
    orderFactory = moduleRef.get(OrderFactory)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /orders/nearby', async () => {
    const user = await deliveryPersonFactory.makePrismaDeliveryPerson()

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const firstRecipient = await recipientFactory.makePrismaRecipient()
    const secondRecipient = await recipientFactory.makePrismaRecipient()
    const thirdRecipient = await recipientFactory.makePrismaRecipient()

    await Promise.all([
      addressFactory.makePrismaAddress({
        recipientId: firstRecipient.id,
        latitude: -31.7622969,
        longitude: -52.3294118,
      }),
      await addressFactory.makePrismaAddress({
        recipientId: secondRecipient.id,
        latitude: -41.7622969,
        longitude: -62.3294118,
      }),
      await addressFactory.makePrismaAddress({
        recipientId: thirdRecipient.id,
        latitude: -31.7622969,
        longitude: -52.3294118,
      }),
      await orderFactory.makePrismaOrder({
        recipientId: firstRecipient.id,
        status: 'WAITING',
      }),
      await orderFactory.makePrismaOrder({
        recipientId: secondRecipient.id,
        status: 'WAITING',
      }),
      await orderFactory.makePrismaOrder({
        recipientId: thirdRecipient.id,
        status: 'STORED',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/orders-nearby`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        latitude: -31.7673115,
        longitude: -52.3462634,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.orders).toHaveLength(1)
  })
})
