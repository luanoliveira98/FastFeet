import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin.factory'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Create Account (E2E)', () => {
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

  test('[POST] /accounts', async () => {
    const user = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const deliveryPerson = {
      name: 'John Doe',
      cpf: '12345678910',
      password: '123456',
    }

    const response = await request(app.getHttpServer())
      .post('/accounts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(deliveryPerson)

    expect(response.statusCode).toBe(201)

    const deliveryPersonOnDatabase = await prisma.user.findUnique({
      where: { cpf: deliveryPerson.cpf },
    })

    expect(deliveryPersonOnDatabase).toBeTruthy()
  })

  test('[POST] /accounts (unauthorized)', async () => {
    const user = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'DELIVERY_PERSON',
    })

    const deliveryPerson = {
      name: 'John Doe 2',
      cpf: '12345678911',
      password: '123456',
    }

    const response = await request(app.getHttpServer())
      .post('/accounts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(deliveryPerson)

    expect(response.statusCode).toBe(401)

    const deliveryPersonOnDatabase = await prisma.user.findFirst({
      where: { cpf: deliveryPerson.cpf },
    })

    expect(deliveryPersonOnDatabase).toBeNull()
  })
})
