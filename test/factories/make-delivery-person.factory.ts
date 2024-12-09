import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import {
  DeliveryPerson,
  DeliveryPersonProps,
} from '@/domain/account/enterprise/entities/delivery-person.entity'
import { faker } from '@faker-js/faker'

export function makeDeliveryPersonFactory(
  override: Partial<DeliveryPersonProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryPerson = DeliveryPerson.create(
    {
      name: faker.person.fullName(),
      cpf: faker.phone.number(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return deliveryPerson
}
