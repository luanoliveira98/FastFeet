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

  async findById(id: string): Promise<OrderConfirmationPhoto> {
    const orderConfirmationPhoto = await this.prisma.orderConfirmationPhoto.findUnique({ where: { id }})

    if (!orderConfirmationPhoto) return null

    return PrismaOrderConfirmationPhotoMapper.toDomain(orderConfirmationPhoto)
  }

  async create(orderConfirmationPhoto: OrderConfirmationPhoto): Promise<void> {
    const data = PrismaOrderConfirmationPhotoMapper.toPrisma(
      orderConfirmationPhoto,
    )

    await this.prisma.orderConfirmationPhoto.create({
      data,
    })
  }

  async save(orderConfirmationPhoto: OrderConfirmationPhoto): Promise<void> {
    const data = PrismaOrderConfirmationPhotoMapper.toPrisma(orderConfirmationPhoto)
  
    await this.prisma.orderConfirmationPhoto.update({
      where: { id: orderConfirmationPhoto.id.toString() },
      data,
    })
  }
}
