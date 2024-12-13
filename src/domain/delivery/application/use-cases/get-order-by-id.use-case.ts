import { Either, left, right } from '@/core/helpers/either.helper'
import { Injectable } from '@nestjs/common'
import { OrdersRepository } from '../repositories/orders.repository.interface'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { Order } from '../../enterprise/entities/order.entity'

interface GetOrderByIdUseCaseRequest {
  id: string
}

type GetOrderByIdUseCaseReponse = Either<
  ResourceNotFoundError,
  { order: Order }
>

@Injectable()
export class GetOrderByIdUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute({
    id,
  }: GetOrderByIdUseCaseRequest): Promise<GetOrderByIdUseCaseReponse> {
    const order = await this.ordersRepository.findById(id)

    if (!order) return left(new ResourceNotFoundError())

    return right({ order })
  }
}
