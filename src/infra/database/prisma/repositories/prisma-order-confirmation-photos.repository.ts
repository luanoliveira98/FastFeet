import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { OrderConfirmationPhotosRepository } from '@/domain/delivery/application/repositories/order-confirmation-photos.repository.interface'
import { OrderConfirmationPhoto } from '@/domain/delivery/enterprise/entities/order-confirmation-photo.entity'
import { PrismaOrderConfirmationPhotoMapper } from '../mappers/prisma-order-confirmation-photo.mapper'

@Injectable()
export class PrismaOrderConfirmationPhotosRepository
  implements OrderConfirmationPhotosRepository
{
  constructor(protected readonly prisma: PrismaService) {}

  async create(orderConfirmationPhoto: OrderConfirmationPhoto): Promise<void> {
    const data = PrismaOrderConfirmationPhotoMapper.toPrisma(
      orderConfirmationPhoto,
    )

    await this.prisma.orderConfirmationPhoto.create({
      data,
    })
  }
}
