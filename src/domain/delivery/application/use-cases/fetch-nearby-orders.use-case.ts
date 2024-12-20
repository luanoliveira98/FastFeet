import { Either, right } from '@/core/helpers/either.helper'
import { Injectable } from '@nestjs/common'
import { OrdersRepository } from '../repositories/orders.repository.interface'
import { Order } from '../../enterprise/entities/order.entity'

interface FetchNearbyOrdersUseCaseRequest {
  deliveryPersonLatitude: number
  deliveryPersonLongitude: number
}

type FetchNearbyOrdersUseCaseReponse = Either<null, { orders: Order[] }>

@Injectable()
export class FetchNearbyOrdersUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute({
    deliveryPersonLatitude,
    deliveryPersonLongitude,
  }: FetchNearbyOrdersUseCaseRequest): Promise<FetchNearbyOrdersUseCaseReponse> {
    const orders = await this.ordersRepository.findManyNearby({
      latitude: deliveryPersonLatitude,
      longitude: deliveryPersonLongitude,
    })

    return right({ orders })
  }
}
