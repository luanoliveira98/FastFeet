import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin.factory'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Decimal } from '@prisma/client/runtime/library'

describe('Create Recipient (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService

  let adminFactory: AdminFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    adminFactory = moduleRef.get(AdminFactory)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /recipients', async () => {
    const user = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const recipient = {
      name: 'John Doe',
      street: 'Rua Dr Cassiano',
      number: 34,
      neighborhood: 'Center',
      city: 'Pelotas',
      state: 'RS',
      zipcode: '12345678',
    }

    const response = await request(app.getHttpServer())
      .post('/recipients')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(recipient)

    expect(response.statusCode).toBe(201)

    const recipientOnDatabase = await prisma.recipient.findFirst({
      where: { name: recipient.name },
      include: { address: true },
    })

    expect(recipientOnDatabase).toBeTruthy()
    expect(recipientOnDatabase.address).toEqual(
      expect.objectContaining({
        zipcode: recipient.zipcode,
        latitude: expect.any(Decimal),
        longitude: expect.any(Decimal),
      }),
    )
  })
})
