import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.value-object'
import { OrderStatus } from '../types/order-status.type'
import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/types/optional.type'

export interface OrderProps {
  recipientId: UniqueEntityID
  deliveryPersonId?: UniqueEntityID | null
  status: OrderStatus
  postedAt: Date
  pickedUpAt?: Date | null
  deliveredAt?: Date | null
}

export class Order extends Entity<OrderProps> {
  get recipientId() {
    return this.props.recipientId
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

  get postedAt() {
    return this.props.postedAt
  }

  get pickedUpAt() {
    return this.props.pickedUpAt
  }

  set pickedUpAt(pickedUpAt: Date) {
    this.props.pickedUpAt = pickedUpAt
  }

  get deliveredAt() {
    return this.props.deliveredAt
  }

  set deliveredAt(deliveredAt: Date) {
    this.props.deliveredAt = deliveredAt
  }

  static create(
    props: Optional<OrderProps, 'postedAt' | 'status'>,
    id?: UniqueEntityID,
  ) {
    return new Order(
      {
        ...props,
        status: props.status ?? 'WAITING',
        postedAt: props.postedAt ?? new Date(),
      },
      id,
    )
  }
}
