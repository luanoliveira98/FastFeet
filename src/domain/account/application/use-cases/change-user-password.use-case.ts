import { Either, left, right } from '@/core/helpers/either.helper'
import { Injectable } from '@nestjs/common'
import { AdminsRepository } from '../repositories/admins.repository.interface'
import { DeliveryPeopleRepository } from '../repositories/delivery-people.repository.interface'
import { DeliveryPerson } from '../../enterprise/entities/delivery-person.entity'
import { Admin } from '../../enterprise/entities/admin.entity'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { HashGenerator } from '../cryptography/hash-generator.interface'

interface ChangeUserPasswordUseCaseRequest {
  userId: string
  password: string
}

type ChangeUserPasswordUseCaseReponse = Either<
  ResourceNotFoundError,
  { user: DeliveryPerson | Admin }
>

@Injectable()
export class ChangeUserPasswordUseCase {
  constructor(
    private readonly adminsRepositoy: AdminsRepository,
    private readonly deliveryPeopleRepository: DeliveryPeopleRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    userId,
    password,
  }: ChangeUserPasswordUseCaseRequest): Promise<ChangeUserPasswordUseCaseReponse> {
    const user = await this.findUser(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    user.password = hashedPassword

    await this.savePassword(user)

    return right({ user })
  }

  private async findUser(
    userId: string,
  ): Promise<Admin | DeliveryPerson | null> {
    const user = await this.adminsRepositoy.findById(userId)

    if (!user) {
      return this.deliveryPeopleRepository.findById(userId)
    }

    return user
  }

  private async savePassword(user: Admin | DeliveryPerson): Promise<void> {
    switch (user.constructor) {
      case Admin:
        await this.adminsRepositoy.save(user)
        break
      case DeliveryPerson:
        await this.adminsRepositoy.save(user)
        break
      default:
        break
    }
  }
}
