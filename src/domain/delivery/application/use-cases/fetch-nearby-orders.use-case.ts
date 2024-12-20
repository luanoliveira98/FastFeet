import { Either, right } from '@/core/helpers/either.helper'
import { Injectable } from '@nestjs/common'
import { OrdersRepository } from '../repositories/orders.repository.interface'
import { Order } from '../../enterprise/entities/order.entity'

interface FetchNearbyOrderUseCaseRequest {
  deliveryPersonLatitude: number
  deliveryPersonLongitude: number
}

type FetchNearbyOrderUseCaseReponse = Either<null, { orders: Order[] }>

@Injectable()
export class FetchNearbyOrderUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute({
    deliveryPersonLatitude,
    deliveryPersonLongitude,
  }: FetchNearbyOrderUseCaseRequest): Promise<FetchNearbyOrderUseCaseReponse> {
    const orders = await this.ordersRepository.findManyNearby({
      latitude: deliveryPersonLatitude,
      longitude: deliveryPersonLongitude,
    })

    return right({ orders })
  }
}
