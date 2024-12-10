import { Either, left, right } from '@/core/helpers/either.helper'
import { Injectable } from '@nestjs/common'
import { DeliveryPeopleRepository } from '../repositories/delivery-people.repository.interface'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

interface DeleteDeliveryPersonUseCaseRequest {
  id: string
}

type DeleteDeliveryPersonUseCaseReponse = Either<ResourceNotFoundError, null>

@Injectable()
export class DeleteDeliveryPersonUseCase {
  constructor(
    private readonly deliveryPeopleRepository: DeliveryPeopleRepository,
  ) {}

  async execute({
    id,
  }: DeleteDeliveryPersonUseCaseRequest): Promise<DeleteDeliveryPersonUseCaseReponse> {
    const deliveryPerson = await this.deliveryPeopleRepository.findById(id)

    if (!deliveryPerson) return left(new ResourceNotFoundError())

    await this.deliveryPeopleRepository.delete(deliveryPerson)

    return right(null)
  }
}
