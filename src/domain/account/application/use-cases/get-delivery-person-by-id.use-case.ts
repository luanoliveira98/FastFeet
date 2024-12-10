import { Either, left, right } from '@/core/helpers/either.helper'
import { Injectable } from '@nestjs/common'
import { DeliveryPeopleRepository } from '../repositories/delivery-people.repository.interface'
import { DeliveryPerson } from '../../enterprise/entities/delivery-person.entity'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

interface GetDeliveryPersonByIdUseCaseRequest {
  id: string
}

type GetDeliveryPersonByIdUseCaseReponse = Either<
  ResourceNotFoundError,
  { deliveryPerson: DeliveryPerson }
>

@Injectable()
export class GetDeliveryPersonByIdUseCase {
  constructor(
    private readonly deliveryPeopleRepository: DeliveryPeopleRepository,
  ) {}

  async execute({
    id,
  }: GetDeliveryPersonByIdUseCaseRequest): Promise<GetDeliveryPersonByIdUseCaseReponse> {
    const deliveryPerson = await this.deliveryPeopleRepository.findById(id)

    if (!deliveryPerson) return left(new ResourceNotFoundError())

    return right({ deliveryPerson })
  }
}
