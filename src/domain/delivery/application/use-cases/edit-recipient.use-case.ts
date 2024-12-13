import { Either, left, right } from '@/core/helpers/either.helper'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { RecipientsRepository } from '../repositories/recipients.repository.interface'
import { Recipient } from '../../enterprise/entities/recipient.entity'

interface EditRecipientUseCaseRequest {
  recipientId: string
  name: string
  street: string
  number: number
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipcode: string
}

type EditRecipientUseCaseReponse = Either<
  ResourceNotFoundError,
  { recipient: Recipient }
>

@Injectable()
export class EditRecipientUseCase {
  constructor(private readonly recipientsRepository: RecipientsRepository) {}

  async execute({
    recipientId,
    name,
    street,
    number,
    complement,
    neighborhood,
    city,
    state,
    zipcode,
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseReponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) return left(new ResourceNotFoundError())

    recipient.name = name
    recipient.street = street
    recipient.number = number
    recipient.complement = complement
    recipient.neighborhood = neighborhood
    recipient.city = city
    recipient.state = state
    recipient.zipcode = zipcode

    await this.recipientsRepository.save(recipient)

    return right({ recipient })
  }
}
