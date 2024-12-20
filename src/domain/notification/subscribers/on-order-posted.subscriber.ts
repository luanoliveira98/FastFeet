import { EventHandler } from '@/core/events/event-handler.interface'
import { OrdersRepository } from '@/domain/delivery/application/repositories/orders.repository.interface'
import { Injectable } from '@nestjs/common'
import { SendNotificationUseCase } from '../use-cases/send-notification.use-case'
import { DomainEvents } from '@/core/events/domain-events'
import { OrderPostedEvent } from '@/domain/delivery/application/events/order-posted.event'

@Injectable()
export class OnOrderPostedSubscriber implements EventHandler {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderPostedNotification.bind(this),
      OrderPostedEvent.name,
    )
  }

  private async sendOrderPostedNotification({
    order,
    ocurredAt,
  }: OrderPostedEvent) {
    const orderPosted = await this.ordersRepository.findById(
      order.id.toString(),
    )

    if (orderPosted) {
      await this.sendNotificationUseCase.execute({
        recipientId: order.recipientId.toString(),
        title: `Order ${orderPosted.id.toString()} posted`,
        content: `Your order was posted at ${ocurredAt} and it is waiting for a delivery person to pick up it`,
      })
    }
  }
}
