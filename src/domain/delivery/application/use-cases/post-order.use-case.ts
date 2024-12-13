import { Either, left, right } from '@/core/helpers/either.helper'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { OrdersRepository } from '../repositories/orders.repository.interface'
import { Order } from '../../enterprise/entities/order.entity'

interface PostOrderUseCaseRequest {
  orderId: string
}

type PostOrderUseCaseReponse = Either<ResourceNotFoundError, { order: Order }>

@Injectable()
export class PostOrderUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
  }: PostOrderUseCaseRequest): Promise<PostOrderUseCaseReponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) return left(new ResourceNotFoundError())

    order.status = 'WAITING'
    order.postedAt = new Date()

    await this.ordersRepository.save(order)

    return right({ order })
  }
}
