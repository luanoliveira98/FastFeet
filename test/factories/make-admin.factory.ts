import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import {
  Admin,
  AdminProps,
} from '@/domain/account/enterprise/entities/admin.entity'
import { faker } from '@faker-js/faker'

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
