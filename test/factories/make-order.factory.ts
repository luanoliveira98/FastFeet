import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.value-object'
import {
  Order,
  OrderProps,
} from '@/domain/delivery/enterprise/entities/order.entity'
import { PrismaOrderMapper } from '@/infra/database/prisma/mappers/prisma-order.mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

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

@Injectable()
export class OrderFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaOrder(data: Partial<OrderProps> = {}): Promise<Order> {
    const order = makeOrderFactory(data)

    await this.prisma.order.create({
      data: PrismaOrderMapper.toPrisma(order),
    })

    return order
  }
}
