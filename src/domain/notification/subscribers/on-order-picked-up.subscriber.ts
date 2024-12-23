import { EventHandler } from '@/core/events/event-handler.interface'
import { OrdersRepository } from '@/domain/delivery/application/repositories/orders.repository.interface'
import { Injectable } from '@nestjs/common'
import { SendNotificationUseCase } from '../use-cases/send-notification.use-case'
import { DomainEvents } from '@/core/events/domain-events'
import { OrderPickedUpEvent } from '@/domain/delivery/application/events/order-picked-up.event'
import { DeliveryPeopleRepository } from '@/domain/account/application/repositories/delivery-people.repository.interface'

@Injectable()
export class OnOrderPickedUpSubscriber implements EventHandler {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly sendNotificationUseCase: SendNotificationUseCase,
    private readonly deliveryPeopleRepository: DeliveryPeopleRepository,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderPickedUpNotification.bind(this),
      OrderPickedUpEvent.name,
    )
  }

  private async sendOrderPickedUpNotification({
    order,
    ocurredAt,
  }: OrderPickedUpEvent) {
    const orderPickedUp = await this.ordersRepository.findById(
      order.id.toString(),
    )

    const deliveryPerson = await this.deliveryPeopleRepository.findById(
      orderPickedUp?.deliveryPersonId.toString(),
    )

    if (deliveryPerson) {
      await this.sendNotificationUseCase.execute({
        recipientId: order.recipientId.toString(),
        title: `Order ${orderPickedUp.id.toString()} picked up`,
        content: `Your order was picked up at ${ocurredAt} and it is going to be delivered by ${deliveryPerson.name}`,
      })
    }
  }
}
