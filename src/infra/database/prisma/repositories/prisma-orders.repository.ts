import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { OrdersRepository } from '@/domain/delivery/application/repositories/orders.repository.interface'
import { Order } from '@/domain/delivery/enterprise/entities/order.entity'
import { PrismaOrderMapper } from '../mappers/prisma-order.mapper'

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    })

    if (!order) return null

    return PrismaOrderMapper.toDomain(order)
  }

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.create({
      data,
    })
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.update({
      where: { id: order.id.toString() },
      data,
    })
  }

  async delete(order: Order): Promise<void> {
    await this.prisma.order.delete({
      where: { id: order.id.toString() },
    })
  }
}
