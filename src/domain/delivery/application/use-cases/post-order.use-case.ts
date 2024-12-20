import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { Either, left, right } from '@/core/helpers/either.helper'
import { Injectable } from '@nestjs/common'
import { Order } from '../../enterprise/entities/order.entity'
import { OrdersRepository } from '../repositories/orders.repository.interface'
import { InvalidOrderError } from './errors/invalid-order.error'

interface PostOrderUseCaseRequest {
  orderId: string
}

type PostOrderUseCaseReponse = Either<
  ResourceNotFoundError | InvalidOrderError,
  { order: Order }
>

@Injectable()
export class PostOrderUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
  }: PostOrderUseCaseRequest): Promise<PostOrderUseCaseReponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) return left(new ResourceNotFoundError())

    const isValidOrder = order.status === 'STORED'

    if (!isValidOrder) return left(new InvalidOrderError())

    order.post()

    await this.ordersRepository.save(order)

    return right({ order })
  }
}
