import { OrderConfirmationPhotosRepository } from '@/domain/delivery/application/repositories/order-confirmation-photos.repository.interface'
import { OrderConfirmationPhoto } from '@/domain/delivery/enterprise/entities/order-confirmation-photo.entity'

export class InMemoryOrderConfirmationPhotosRepository
  implements OrderConfirmationPhotosRepository
{
  public items: OrderConfirmationPhoto[] = []

  async create(orderConfirmationPhoto: OrderConfirmationPhoto): Promise<void> {
    this.items.push(orderConfirmationPhoto)
  }
}
