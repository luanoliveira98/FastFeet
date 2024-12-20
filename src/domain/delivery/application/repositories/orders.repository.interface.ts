import { Order } from '../../enterprise/entities/order.entity'

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}

export abstract class OrdersRepository {
  abstract findById(id: string): Promise<Order | null>
  abstract findManyNearby(params: FindManyNearbyParams): Promise<Order[]>
  abstract create(order: Order): Promise<void>
  abstract save(order: Order): Promise<void>
  abstract delete(order: Order): Promise<void>
}
