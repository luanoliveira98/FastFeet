import { Either, left, right } from '@/core/helpers/either.helper'
import { Injectable } from '@nestjs/common'
import { OrdersRepository } from '../repositories/orders.repository.interface'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { Order } from '../../enterprise/entities/order.entity'
import { DeliveryPeopleRepository } from '@/domain/account/application/repositories/delivery-people.repository.interface'

interface FetchDeliveryPersonDeliveriesUseCaseRequest {
  deliveryPersonId: string
}

type FetchDeliveryPersonDeliveriesUseCaseReponse = Either<
  ResourceNotFoundError,
  { deliveries: Order[] }
>

@Injectable()
export class FetchDeliveryPersonDeliveriesUseCase {
  constructor(
    private readonly deliveryPeopleRepository: DeliveryPeopleRepository,
    private readonly ordersRepository: OrdersRepository,
  ) {}

  async execute({
    deliveryPersonId,
  }: FetchDeliveryPersonDeliveriesUseCaseRequest): Promise<FetchDeliveryPersonDeliveriesUseCaseReponse> {
    const deliveryPerson =
      await this.deliveryPeopleRepository.findById(deliveryPersonId)

    if (!deliveryPerson) return left(new ResourceNotFoundError())

    const deliveries =
      await this.ordersRepository.findManyDeliveriesByDeliveryPersonId(
        deliveryPersonId,
      )

    return right({ deliveries })
  }
}
