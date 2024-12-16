import { OrderConfirmationPhoto } from '../../enterprise/entities/order-confirmation-photo.entity'

export abstract class OrderConfirmationPhotosRepository {
  abstract create(orderConfirmationPhoto: OrderConfirmationPhoto): Promise<void>
}
