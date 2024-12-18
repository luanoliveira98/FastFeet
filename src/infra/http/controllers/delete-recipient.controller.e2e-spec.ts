import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin.factory'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { RecipientFactory } from 'test/factories/make-recipient.factory'
import { AddressFactory } from 'test/factories/make-address.factory'

describe('Delete Recipient (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService

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
    prisma = moduleRef.get(PrismaService)

    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    addressFactory = moduleRef.get(AddressFactory)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[DELETE] /recipients/:id', async () => {
    const user = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const recipient = await recipientFactory.makePrismaRecipient()

    await addressFactory.makePrismaAddress({
      recipientId: recipient.id,
    })

    const recipientId = recipient.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/recipients/${recipientId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const recipientOnDatabase = await prisma.recipient.findUnique({
      where: { id: recipientId },
    })

    expect(recipientOnDatabase).toBeNull()

    const addressOnDatabase = await prisma.address.findUnique({
      where: { recipientId },
    })

    expect(addressOnDatabase).toBeNull()
  })
})
