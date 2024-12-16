import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.value-object'
import { OrderConfirmationPhoto } from '@/domain/delivery/enterprise/entities/order-confirmation-photo.entity'
import {
  Prisma,
  OrderConfirmationPhoto as PrismaOrderConfirmationPhoto,
} from '@prisma/client'

export class PrismaOrderConfirmationPhotoMapper {
  static toDomain(raw: PrismaOrderConfirmationPhoto) {
    return OrderConfirmationPhoto.create(
      {
        title: raw.title,
        url: raw.url,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    orderConfirmationPhoto: OrderConfirmationPhoto,
  ): Prisma.OrderConfirmationPhotoUncheckedCreateInput {
    return {
      id: orderConfirmationPhoto.id.toString(),
      title: orderConfirmationPhoto.title,
      url: orderConfirmationPhoto.url,
    }
  }
}
