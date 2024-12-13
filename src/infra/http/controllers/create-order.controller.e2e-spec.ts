import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin.factory'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { RecipientFactory } from 'test/factories/make-recipient.factory'

describe('Create Order (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService

  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /orders', async () => {
    const user = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const recipient = await recipientFactory.makePrismaRecipient()

    const order = {
      recipientId: recipient.id.toString(),
    }

    const response = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(order)

    expect(response.statusCode).toBe(201)

    const orderOnDatabase = await prisma.order.findFirst({
      where: { recipientId: recipient.id.toString() },
    })

    expect(orderOnDatabase).toBeTruthy()
  })
})
