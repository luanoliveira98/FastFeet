import { Either, left, right } from '@/core/helpers/either.helper'
import { Injectable } from '@nestjs/common'
import { DeliveryPeopleRepository } from '../repositories/delivery-people.repository.interface'
import { DeliveryPerson } from '../../enterprise/entities/delivery-person.entity'
import { HashGenerator } from '../cryptography/hash-generator.interface'
import { DeliveryPersonAlreadyExistsError } from './errors/delivery-person-already-exists.error'

interface RegisterDeliveryPersonUseCaseRequest {
  name: string
  cpf: string
  password: string
}

type RegisterDeliveryPersonUseCaseReponse = Either<
  DeliveryPersonAlreadyExistsError,
  { deliveryPerson: DeliveryPerson }
>

@Injectable()
export class RegisterDeliveryPersonUseCase {
  constructor(
    private readonly deliveryPeopleRepository: DeliveryPeopleRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
  }: RegisterDeliveryPersonUseCaseRequest): Promise<RegisterDeliveryPersonUseCaseReponse> {
    const deliveryPersonWithSameCpf =
      await this.deliveryPeopleRepository.findByCpf(cpf)

    if (deliveryPersonWithSameCpf)
      return left(new DeliveryPersonAlreadyExistsError(cpf))

    const hashedPassword = await this.hashGenerator.hash(password)

    const deliveryPerson = DeliveryPerson.create({
      name,
      cpf,
      password: hashedPassword,
    })

    await this.deliveryPeopleRepository.create(deliveryPerson)

    return right({ deliveryPerson })
  }
}
