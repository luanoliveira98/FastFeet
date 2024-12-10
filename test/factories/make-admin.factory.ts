import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import {
  Admin,
  AdminProps,
} from '@/domain/account/enterprise/entities/admin.entity'
import { PrismaAdminMapper } from '@/infra/database/prisma/mappers/prisma-admin.mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeAdminFactory(
  override: Partial<AdminProps> = {},
  id?: UniqueEntityID,
) {
  const admin = Admin.create(
    {
      name: faker.person.fullName(),
      cpf: faker.phone.number(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return admin
}

@Injectable()
export class AdminFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaAdmin(data: Partial<AdminProps> = {}): Promise<Admin> {
    const admin = makeAdminFactory(data)

    await this.prisma.user.create({
      data: PrismaAdminMapper.toPrisma(admin),
    })

    return admin
  }
}
