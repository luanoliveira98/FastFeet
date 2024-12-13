import { Either, left, right } from '@/core/helpers/either.helper'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { OrdersRepository } from '../repositories/orders.repository.interface'
import { Order } from '../../enterprise/entities/order.entity'
import { OrderStatus } from '@prisma/client'
import { DeliveryPeopleRepository } from '@/domain/account/application/repositories/delivery-people.repository.interface'
import { InvalidDeliveryPersonError } from './errors/invalid-delivery-person.error'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.value-object'
import { RecipientsRepository } from '../repositories/recipients.repository.interface'
import { InvalidRecipientError } from './errors/invalid-recipient.error'
import dayjs from 'dayjs'
import { InvalidDatesError } from './errors/invalid-dates.error'

interface AreValidDates {
  storedAt: Date
  postedAt: Date
  pickedUpAt?: Date
  deliveredAt?: Date
}

interface EditOrderUseCaseRequest {
  orderId: string
  recipientId: string
  deliveryPersonId?: string
  status: OrderStatus
  storedAt: Date
  postedAt?: Date
  pickedUpAt?: Date
  deliveredAt?: Date
}

type EditOrderUseCaseReponse = Either<
  | ResourceNotFoundError
  | InvalidRecipientError
  | InvalidDeliveryPersonError
  | InvalidDatesError,
  { order: Order }
>

@Injectable()
export class EditOrderUseCase {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    protected readonly deliveryPeopleRepository: DeliveryPeopleRepository,
    protected readonly recipientsRepository: RecipientsRepository,
  ) {}

  async execute({
    orderId,
    recipientId,
    deliveryPersonId,
    status,
    storedAt,
    postedAt,
    pickedUpAt,
    deliveredAt,
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseReponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) return left(new ResourceNotFoundError())

    if (order.recipientId.toString() !== recipientId) {
      const recipient = await this.recipientsRepository.findById(recipientId)

      if (!recipient) return left(new InvalidRecipientError())
    }

    if (order.deliveryPersonId?.toString() !== deliveryPersonId) {
      const deliveryPerson =
        await this.deliveryPeopleRepository.findById(deliveryPersonId)

      if (!deliveryPerson) return left(new InvalidDeliveryPersonError())
    }

    if (postedAt) {
      const areValidDates = this.areValidDates({
        storedAt,
        postedAt,
        pickedUpAt,
        deliveredAt,
      })

      console.log(areValidDates)

      if (!areValidDates) return left(new InvalidDatesError())
    }

    order.recipientId = new UniqueEntityID(recipientId)
    order.deliveryPersonId = new UniqueEntityID(deliveryPersonId)
    order.status = status
    order.storedAt = storedAt
    order.postedAt = postedAt
    order.pickedUpAt = pickedUpAt
    order.deliveredAt = deliveredAt

    await this.ordersRepository.save(order)

    return right({ order })
  }

  private areValidDates({
    storedAt,
    postedAt,
    pickedUpAt,
    deliveredAt,
  }: AreValidDates) {
    const isPostedAtInvalid = postedAt
      ? dayjs(postedAt).isAfter(storedAt)
      : true

    const isPickedUpAtInvalid = pickedUpAt
      ? dayjs(pickedUpAt).isAfter(postedAt)
      : true

    const isDeliveredAtInvalid = deliveredAt
      ? dayjs(deliveredAt).isAfter(pickedUpAt)
      : true

    return isPostedAtInvalid && isPickedUpAtInvalid && isDeliveredAtInvalid
  }
}
