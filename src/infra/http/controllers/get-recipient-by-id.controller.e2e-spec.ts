import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin.factory'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { RecipientFactory } from 'test/factories/make-recipient.factory'
import { AddressFactory } from 'test/factories/make-address.factory'

describe('Get Recipient By Id (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService

  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory
  let addressFactory: AddressFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, RecipientFactory, AddressFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)

    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    addressFactory = moduleRef.get(AddressFactory)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /recipients/:id', async () => {
    const user = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const recipient = await recipientFactory.makePrismaRecipient()

    const address = await addressFactory.makePrismaAddress({
      recipientId: recipient.id,
    })

    const recipientId = recipient.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/recipients/${recipientId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      recipient: expect.objectContaining({
        recipientId,
        addressId: address.id.toString(),
      }),
    })
  })
})
