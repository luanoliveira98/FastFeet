import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.value-object'
import { OrderConfirmationPhoto, OrderConfirmationPhotoProps } from '@/domain/delivery/enterprise/entities/order-confirmation-photo.entity'
import { PrismaOrderConfirmationPhotoMapper } from '@/infra/database/prisma/mappers/prisma-order-confirmation-photo.mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeOrderConfirmationPhotoFactory(
  override: Partial<OrderConfirmationPhotoProps> = {},
  id?: UniqueEntityID,
) {
  const order = OrderConfirmationPhoto.create(
    {
      orderId: null,
      url: faker.internet.url(),
      title: faker.word.verb(),
      ...override,
    },
    id,
  )

  return order
}

@Injectable()
export class OrderConfirmationPhotoFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaOrderConfirmationPhoto(data: Partial<OrderConfirmationPhotoProps> = {}): Promise<OrderConfirmationPhoto> {
    const order = makeOrderConfirmationPhotoFactory(data)

    await this.prisma.orderConfirmationPhoto.create({
      data: PrismaOrderConfirmationPhotoMapper.toPrisma(order),
    })

    return order
  }
}
