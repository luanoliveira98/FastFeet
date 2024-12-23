import { Either, left, right } from '@/core/helpers/either.helper'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { OrdersRepository } from '../repositories/orders.repository.interface'
import { Order } from '../../enterprise/entities/order.entity'
import { DeliveryPeopleRepository } from '@/domain/account/application/repositories/delivery-people.repository.interface'
import { InvalidDeliveryPersonError } from './errors/invalid-delivery-person.error'
import { InvalidOrderError } from './errors/invalid-order.error'

interface PickUpOrderUseCaseRequest {
  orderId: string
  deliveryPersonId: string
}

type PickUpOrderUseCaseReponse = Either<
  ResourceNotFoundError | InvalidOrderError | InvalidDeliveryPersonError,
  { order: Order }
>

@Injectable()
export class PickUpOrderUseCase {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly deliveryPeopleRepository: DeliveryPeopleRepository,
  ) {}

  async execute({
    orderId,
    deliveryPersonId,
  }: PickUpOrderUseCaseRequest): Promise<PickUpOrderUseCaseReponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) return left(new ResourceNotFoundError())

    const isValidOrder = order.status === 'WAITING' && order.postedAt !== null

    if (!isValidOrder) return left(new InvalidOrderError())

    const deliveryPerson =
      await this.deliveryPeopleRepository.findById(deliveryPersonId)

    if (!deliveryPerson) return left(new InvalidDeliveryPersonError())

    order.deliveryPersonId = deliveryPerson.id
    order.pickUp()

    await this.ordersRepository.save(order)

    return right({ order })
  }
}
