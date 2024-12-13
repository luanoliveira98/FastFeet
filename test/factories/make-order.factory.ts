import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.value-object'
import {
  Order,
  OrderProps,
} from '@/domain/delivery/enterprise/entities/order.entity'
import { faker } from '@faker-js/faker'

export function makeOrderFactory(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
) {
  const order = Order.create(
    {
      recipientId: new UniqueEntityID(faker.string.uuid()),
      status: 'STORED',
      storedAt: faker.date.past(),
      ...override,
    },
    id,
  )

  return order
}
