import { EventHandler } from '@/core/events/event-handler.interface'
import { OrdersRepository } from '@/domain/delivery/application/repositories/orders.repository.interface'
import { Injectable } from '@nestjs/common'
import { SendNotificationUseCase } from '../use-cases/send-notification.use-case'
import { DomainEvents } from '@/core/events/domain-events'
import { OrderDeliveredEvent } from '@/domain/delivery/application/events/order-delivered.event'

@Injectable()
export class OnOrderDeliveredSubscriber implements EventHandler {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderDeliveredNotification.bind(this),
      OrderDeliveredEvent.name,
    )
  }

  private async sendOrderDeliveredNotification({
    order,
    ocurredAt,
  }: OrderDeliveredEvent) {
    const orderDelivered = await this.ordersRepository.findById(
      order.id.toString(),
    )

    if (orderDelivered) {
      await this.sendNotificationUseCase.execute({
        recipientId: order.recipientId.toString(),
        title: `Order ${orderDelivered.id.toString()} delivered`,
        content: `Your order was delivered at ${ocurredAt}`,
      })
    }
  }
}
