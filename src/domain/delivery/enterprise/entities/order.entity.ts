import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.value-object'
import { OrderStatus } from '../types/order-status.type'
import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/types/optional.type'

export interface OrderProps {
  recipientId: UniqueEntityID
  deliveryPersonId?: UniqueEntityID | null
  status: OrderStatus
  storedAt: Date
  postedAt?: Date | null
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

  get storedAt() {
    return this.props.storedAt
  }

  get postedAt() {
    return this.props.postedAt
  }

  set postedAt(postedAt: Date) {
    this.props.postedAt = postedAt
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
