import { Either, right } from '@/core/helpers/either.helper'
import { Injectable } from '@nestjs/common'
import { Recipient } from '../../enterprise/entities/recipient.entity'
import { RecipientsRepository } from '../repositories/recipients.repository.interface'

interface RegisterRecipientUseCaseRequest {
  name: string
  street: string
  number: number
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipcode: string
}

type RegisterRecipientUseCaseReponse = Either<null, { recipient: Recipient }>

@Injectable()
export class RegisterRecipientUseCase {
  constructor(private readonly recipientsRepository: RecipientsRepository) {}

  async execute({
    name,
    street,
    number,
    complement,
    neighborhood,
    city,
    state,
    zipcode,
  }: RegisterRecipientUseCaseRequest): Promise<RegisterRecipientUseCaseReponse> {
    const recipient = Recipient.create({
      name,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zipcode,
    })

    await this.recipientsRepository.create(recipient)

    return right({ recipient })
  }
}
