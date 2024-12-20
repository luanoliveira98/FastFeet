import {
  FindManyNearbyParams,
  OrdersRepository,
} from '@/domain/delivery/application/repositories/orders.repository.interface'
import { Order } from '@/domain/delivery/enterprise/entities/order.entity'
import { getDistanceBetweenCoordinates } from 'test/utils/get-distance-between-cordinates.util'
import { InMemoryAddressesRepository } from './in-memory-addresses.repository'
import { DomainEvents } from '@/core/events/domain-events'

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = []

  constructor(
    private readonly addressRepository: InMemoryAddressesRepository,
  ) {}

  async findById(id: string): Promise<Order | null> {
    const order = this.items.find((item) => item.id.toString() === id)

    if (!order) return null

    return order
  }

  async findManyNearby(params: FindManyNearbyParams): Promise<Order[]> {
    const MAX_DISTANCE_IN_KILOMETERS = 2

    const ordersWithDistance = await Promise.all(
      this.items.map(async (item) => {
        const address = await this.addressRepository.findByRecipientId(
          item.recipientId.toString(),
        )

        if (!address) throw new Error('Recipient address not found')

        const distance = getDistanceBetweenCoordinates(
          { latitude: params.latitude, longitude: params.longitude },
          { latitude: address.latitude, longitude: address.longitude },
        )

        return { item, distance }
      }),
    )

    const nearbyOrders = ordersWithDistance
      .filter(({ item, distance }) => {
        return (
          distance < MAX_DISTANCE_IN_KILOMETERS && item.status === 'WAITING'
        )
      })
      .map(({ item }) => item)

    return nearbyOrders
  }

  async findManyDeliveriesByDeliveryPersonId(
    deliveryPersonId: string,
  ): Promise<Order[]> {
    const deliveries = this.items.filter(
      (item) =>
        item.deliveryPersonId.toString() === deliveryPersonId &&
        item.status === 'DELIVERED',
    )

    return deliveries
  }

  async create(order: Order): Promise<void> {
    this.items.push(order)
  }

  async save(order: Order): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items[itemIndex] = order

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async delete(order: Order): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items.splice(itemIndex, 1)
  }
}
