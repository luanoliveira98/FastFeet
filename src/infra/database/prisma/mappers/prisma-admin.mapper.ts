import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.value-object'
import { Admin } from '@/domain/account/enterprise/entities/admin.entity'
import { User as PrismaUser, Prisma } from '@prisma/client'

export class PrismaAdminMapper {
  static toDomain(raw: PrismaUser) {
    return Admin.create(
      {
        name: raw.name,
        cpf: raw.cpf,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(admin: Admin): Prisma.UserUncheckedCreateInput {
    return {
      id: admin.id.toString(),
      name: admin.name,
      cpf: admin.cpf,
      password: admin.password,
      role: 'ADMIN',
    }
  }
}
