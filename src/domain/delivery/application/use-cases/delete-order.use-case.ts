import { Either, left, right } from '@/core/helpers/either.helper'
import { Injectable } from '@nestjs/common'
import { OrdersRepository } from '../repositories/orders.repository.interface'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

interface DeleteOrderUseCaseRequest {
  id: string
}

type DeleteOrderUseCaseReponse = Either<ResourceNotFoundError, null>

@Injectable()
export class DeleteOrderUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute({
    id,
  }: DeleteOrderUseCaseRequest): Promise<DeleteOrderUseCaseReponse> {
    const order = await this.ordersRepository.findById(id)

    if (!order) return left(new ResourceNotFoundError())

    await this.ordersRepository.delete(order)

    return right(null)
  }
}
