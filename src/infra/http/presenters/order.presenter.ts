import { Order } from '@/domain/delivery/enterprise/entities/order.entity'

export class OrderPresenter {
  static toHttp(order: Order) {
    return {
      orderId: order.id.toString(),
      recipientId: order.recipientId.toString(),
      deliveryPersonId: order.deliveryPersonId.toString(),
      status: order.status,
      storedAt: order.storedAt,
      postedAt: order.postedAt,
      pickedUpAt: order.pickedUpAt,
      deliveredAt: order.deliveredAt,
    }
  }
}
