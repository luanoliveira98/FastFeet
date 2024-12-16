import { OrderConfirmationPhotosRepository } from '@/domain/delivery/application/repositories/order-confirmation-photos.repository.interface'
import { OrderConfirmationPhoto } from '@/domain/delivery/enterprise/entities/order-confirmation-photo.entity'

export class InMemoryOrderConfirmationPhotosRepository
  implements OrderConfirmationPhotosRepository
{
  public items: OrderConfirmationPhoto[] = []

  async findById(id: string): Promise<OrderConfirmationPhoto> {
    const orderConfirmationPhoto = this.items.find((item) => item.id.toString() === id)

    if (!orderConfirmationPhoto) return null

    return orderConfirmationPhoto
  }

  async create(orderConfirmationPhoto: OrderConfirmationPhoto): Promise<void> {
    this.items.push(orderConfirmationPhoto)
  }

  async save(orderConfirmationPhoto: OrderConfirmationPhoto): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === orderConfirmationPhoto.id)
  
    this.items[itemIndex] = orderConfirmationPhoto
  }  
}
