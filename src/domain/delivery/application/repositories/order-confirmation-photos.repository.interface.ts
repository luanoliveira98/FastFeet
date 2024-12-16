import { OrderConfirmationPhoto } from '../../enterprise/entities/order-confirmation-photo.entity'

export abstract class OrderConfirmationPhotosRepository {
  abstract findById(id: string): Promise<OrderConfirmationPhoto>
  abstract create(orderConfirmationPhoto: OrderConfirmationPhoto): Promise<void>
  abstract save(orderConfirmationPhoto: OrderConfirmationPhoto) : Promise<void>
}
