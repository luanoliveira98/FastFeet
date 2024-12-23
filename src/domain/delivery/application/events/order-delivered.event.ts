import { DomainEvent } from '@/core/events/domain-event.interface'
import { Order } from '../../enterprise/entities/order.entity'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.value-object'

export class OrderDeliveredEvent implements DomainEvent {
  public ocurredAt: Date
  public order: Order

  constructor(order: Order) {
    this.ocurredAt = new Date()
    this.order = order
  }

  getAggregateId(): UniqueEntityID {
    return this.order.id
  }
}
