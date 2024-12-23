import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.value-object'
import { OrderStatus } from '../types/order-status.type'
import { Optional } from '@/core/types/optional.type'
import { AggregateRoot } from '@/core/entities/aggregate-root.entity'
import { OrderPostedEvent } from '../../application/events/order-posted.event'
import { OrderPickedUpEvent } from '../../application/events/order-picked-up.event'
import { OrderDeliveredEvent } from '../../application/events/order-delivered.event'

export interface OrderProps {
  recipientId: UniqueEntityID
  deliveryPersonId?: UniqueEntityID | null
  status: OrderStatus
  storedAt: Date
  postedAt?: Date | null
  pickedUpAt?: Date | null
  deliveredAt?: Date | null
}

export class Order extends AggregateRoot<OrderProps> {
  get recipientId() {
    return this.props.recipientId
  }

  set recipientId(recipientId: UniqueEntityID) {
    this.props.recipientId = recipientId
  }

  get deliveryPersonId() {
    return this.props.deliveryPersonId
  }

  set deliveryPersonId(deliveryPersonId: UniqueEntityID) {
    this.props.deliveryPersonId = deliveryPersonId
  }

  get status() {
    return this.props.status
  }

  set status(status: OrderStatus) {
    this.props.status = status
  }

  get storedAt() {
    return this.props.storedAt
  }

  set storedAt(storedAt: Date) {
    this.props.storedAt = storedAt
  }

  get postedAt() {
    return this.props.postedAt
  }

  set postedAt(postedAt: Date) {
    this.props.postedAt = postedAt
  }

  post() {
    if (!this.props.postedAt) this.addDomainEvent(new OrderPostedEvent(this))

    this.props.postedAt = new Date()
    this.props.status = 'WAITING'
  }

  get pickedUpAt() {
    return this.props.pickedUpAt
  }

  set pickedUpAt(pickedUpAt: Date) {
    this.props.pickedUpAt = pickedUpAt
  }

  pickUp() {
    if (!this.props.pickedUpAt)
      this.addDomainEvent(new OrderPickedUpEvent(this))

    this.props.pickedUpAt = new Date()
    this.props.status = 'PICKED_UP'
  }

  get deliveredAt() {
    return this.props.deliveredAt
  }

  set deliveredAt(deliveredAt: Date) {
    this.props.deliveredAt = deliveredAt
  }

  delivered() {
    if (!this.props.deliveredAt)
      this.addDomainEvent(new OrderDeliveredEvent(this))

    this.props.deliveredAt = new Date()
    this.props.status = 'DELIVERED'
  }

  static create(
    props: Optional<OrderProps, 'status' | 'storedAt'>,
    id?: UniqueEntityID,
  ) {
    return new Order(
      {
        ...props,
        status: props.status ?? 'STORED',
        storedAt: props.postedAt ?? new Date(),
      },
      id,
    )
  }
}
