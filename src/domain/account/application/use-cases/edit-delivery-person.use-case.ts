import { Either, left, right } from '@/core/helpers/either.helper'
import { Injectable } from '@nestjs/common'
import { DeliveryPeopleRepository } from '../repositories/delivery-people.repository.interface'
import { DeliveryPerson } from '../../enterprise/entities/delivery-person.entity'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { DeliveryPersonAlreadyExistsError } from './errors/delivery-person-already-exists.error'

interface EditDeliveryPersonUseCaseRequest {
  deliveryPersonId: string
  name: string
  cpf: string
}

type EditDeliveryPersonUseCaseReponse = Either<
  ResourceNotFoundError | DeliveryPersonAlreadyExistsError,
  { deliveryPerson: DeliveryPerson }
>

@Injectable()
export class EditDeliveryPersonUseCase {
  constructor(
    private readonly deliveryPeopleRepository: DeliveryPeopleRepository,
  ) {}

  async execute({
    deliveryPersonId,
    cpf,
    name,
  }: EditDeliveryPersonUseCaseRequest): Promise<EditDeliveryPersonUseCaseReponse> {
    const deliveryPerson =
      await this.deliveryPeopleRepository.findById(deliveryPersonId)

    if (!deliveryPerson) return left(new ResourceNotFoundError())

    const deliveryPersonWithSameCpf =
      await this.deliveryPeopleRepository.findByCpf(cpf)

    const isSameCpfAndDifferentDeliveryPerson =
      deliveryPersonWithSameCpf &&
      !deliveryPersonWithSameCpf.equals(deliveryPerson)

    console.log(
      isSameCpfAndDifferentDeliveryPerson,
      deliveryPersonWithSameCpf,
      deliveryPerson,
    )

    if (isSameCpfAndDifferentDeliveryPerson)
      return left(new DeliveryPersonAlreadyExistsError(cpf))

    deliveryPerson.name = name
    deliveryPerson.cpf = cpf

    await this.deliveryPeopleRepository.save(deliveryPerson)

    return right({ deliveryPerson })
  }
}
