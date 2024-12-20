import {
  FindManyNearbyParams,
  OrdersRepository,
} from '@/domain/delivery/application/repositories/orders.repository.interface'
import { Order } from '@/domain/delivery/enterprise/entities/order.entity'

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = []

  // constructor(
  //   private readonly addressRepository: InMemoryAddressesRepository,
  // ) {}

  async findById(id: string): Promise<Order | null> {
    const order = this.items.find((item) => item.id.toString() === id)

    if (!order) return null

    return order
  }

  async findManyNearby(params: FindManyNearbyParams): Promise<Order[]> {
    // const MAX_DISTANCE_IN_KILOMETERS = 1

    // const orders = this.items.filter((item) => {
    //   const address = this.addressRepository.findByRecipientId(
    //     item.recipientId.toString(),
    //   )

    //   if (!address) throw new Error('Recipient address not found')

    // })
    return this.items
  }

  async create(order: Order): Promise<void> {
    this.items.push(order)
  }

  async save(order: Order): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items[itemIndex] = order
  }

  async delete(order: Order): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items.splice(itemIndex, 1)
  }
}
