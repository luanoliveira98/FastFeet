import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import {
  FindManyNearbyParams,
  OrdersRepository,
} from '@/domain/delivery/application/repositories/orders.repository.interface'
import { Order } from '@/domain/delivery/enterprise/entities/order.entity'
import { PrismaOrderMapper } from '../mappers/prisma-order.mapper'
import { Order as PrismaOrder } from 'prisma'

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

  async findManyNearby({
    latitude,
    longitude,
  }: FindManyNearbyParams): Promise<Order[]> {
    const MAX_DISTANCE_IN_KILOMETERS = 2

    const orders = await this.prisma.$queryRaw<PrismaOrder[]>`
      SELECT * FROM orders
      JOIN addresses ON addresses.recipient_id = orders.recipient_id
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( addresses.latitude ) ) * cos( radians( addresses.longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( addresses.latitude ) ) ) ) <= ${MAX_DISTANCE_IN_KILOMETERS}
      and orders.status = 'WAITING'
    `

    return orders.map(PrismaOrderMapper.toDomain)
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
