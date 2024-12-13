import { Either, right } from '@/core/helpers/either.helper'
import { Injectable } from '@nestjs/common'
import { Order } from '../../enterprise/entities/order.entity'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.value-object'
import { OrdersRepository } from '../repositories/orders.repository.interface'

interface RegisterOrderUseCaseRequest {
  recipientId: string
}

type RegisterOrderUseCaseReponse = Either<null, { order: Order }>

@Injectable()
export class RegisterOrderUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute({
    recipientId,
  }: RegisterOrderUseCaseRequest): Promise<RegisterOrderUseCaseReponse> {
    const order = Order.create({
      recipientId: new UniqueEntityID(recipientId),
    })

    await this.ordersRepository.create(order)

    return right({ order })
  }
}
