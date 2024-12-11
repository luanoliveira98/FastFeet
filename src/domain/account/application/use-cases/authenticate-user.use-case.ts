import { Either, left, right } from '@/core/helpers/either.helper'
import { Injectable } from '@nestjs/common'
import { AdminsRepository } from '../repositories/admins.repository.interface'
import { DeliveryPeopleRepository } from '../repositories/delivery-people.repository.interface'
import { Encrypter } from '../cryptography/encrypter.interface'
import { WrongCredentialsError } from './errors/wrong-credentials.error'
import { DeliveryPerson } from '../../enterprise/entities/delivery-person.entity'
import { Admin } from '../../enterprise/entities/admin.entity'
import { HashComparer } from '../cryptography/hash-comparer.interface'

interface AuthenticateUserUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateUserUseCaseReponse = Either<
  WrongCredentialsError,
  { accessToken: string }
>

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private readonly adminsRepositoy: AdminsRepository,
    private readonly deliveryPeopleRepository: DeliveryPeopleRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseReponse> {
    const user = await this.findUser(cpf)

    if (!user) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
      role: user.role,
    })

    return right({ accessToken })
  }

  private async findUser(cpf: string): Promise<Admin | DeliveryPerson | null> {
    const user = await this.adminsRepositoy.findByCpf(cpf)

    if (!user) {
      return this.deliveryPeopleRepository.findByCpf(cpf)
    }

    return user
  }
}
