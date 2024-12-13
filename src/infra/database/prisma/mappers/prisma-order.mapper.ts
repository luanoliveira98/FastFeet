import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.value-object'
import { Order } from '@/domain/delivery/enterprise/entities/order.entity'
import { Order as PrismaOrder, Prisma } from '@prisma/client'

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder) {
    return Order.create(
      {
        recipientId: new UniqueEntityID(raw.recipientId),
        deliveryPersonId: new UniqueEntityID(raw.deliveryPersonId),
        status: raw.status,
        storedAt: raw.storedAt,
        postedAt: raw.postedAt,
        pickedUpAt: raw.pickedUpAt,
        deliveredAt: raw.deliveredAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      recipientId: order.recipientId.toString(),
      deliveryPersonId: order.deliveryPersonId
        ? order.deliveryPersonId.toString()
        : null,
      status: order.status,
      storedAt: order.storedAt,
      postedAt: order.postedAt,
      pickedUpAt: order.pickedUpAt,
      deliveredAt: order.deliveredAt,
    }
  }
}
