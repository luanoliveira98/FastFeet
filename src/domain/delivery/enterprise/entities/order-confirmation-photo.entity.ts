import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.value-object'

export interface OrderConfirmationPhotoProps {
  orderId?: UniqueEntityID | null
  title: string
  url: string
}

export class OrderConfirmationPhoto extends Entity<OrderConfirmationPhotoProps> {
  get orderId() {
    return this.props.orderId
  }

  set orderId(orderId: UniqueEntityID) {
    this.props.orderId = orderId
  }

  get title() {
    return this.props.title
  }

  get url() {
    return this.props.url
  }

  static create(props: OrderConfirmationPhotoProps, id?: UniqueEntityID) {
    return new OrderConfirmationPhoto(props, id)
  }
}
