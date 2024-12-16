import { Either, left, right } from '@/core/helpers/either.helper'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { OrdersRepository } from '../repositories/orders.repository.interface'
import { Order } from '../../enterprise/entities/order.entity'
import { InvalidOrderError } from './errors/invalid-order.error'
import { NotAllowedError } from '@/domain/account/application/use-cases/errors/not-allowed.error'
import { OrderConfirmationPhotosRepository } from '../repositories/order-confirmation-photos.repository.interface'
import { InvalidOrderConfirmationPhotoError } from './errors/invalid-order-confirmation-photo.error'

interface DeliveryOrderUseCaseRequest {
  orderId: string
  deliveryPersonId: string
  confirmationPhotoId: string
}

type DeliveryOrderUseCaseReponse = Either<
  ResourceNotFoundError | InvalidOrderConfirmationPhotoError | InvalidOrderError | NotAllowedError,
  { order: Order }
>

@Injectable()
export class DeliveryOrderUseCase {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly orderConfirmationPhotosRepository: OrderConfirmationPhotosRepository,
  ) {}

  async execute({
    orderId,
    deliveryPersonId,
    confirmationPhotoId,
  }: DeliveryOrderUseCaseRequest): Promise<DeliveryOrderUseCaseReponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) return left(new ResourceNotFoundError())

    if (order.deliveryPersonId.toString() !== deliveryPersonId) return left(new NotAllowedError())

    const confirmationPhoto = await this.orderConfirmationPhotosRepository.findById(confirmationPhotoId)

    if (!confirmationPhoto) return left(new InvalidOrderConfirmationPhotoError())

    const isValidOrder = order.status === 'PICKED_UP' && order.pickedUpAt !== null

    if (!isValidOrder) return left(new InvalidOrderError())

    order.status = 'DELIVERED'
    order.deliveredAt = new Date()

    await this.ordersRepository.save(order)

    confirmationPhoto.orderId = order.id
    
    await this.orderConfirmationPhotosRepository.save(confirmationPhoto)

    return right({ order })
  }
}
