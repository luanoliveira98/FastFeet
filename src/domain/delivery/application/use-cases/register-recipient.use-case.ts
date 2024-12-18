import { Either, right } from '@/core/helpers/either.helper'
import { Injectable } from '@nestjs/common'
import { Recipient } from '../../enterprise/entities/recipient.entity'
import { RecipientsRepository } from '../repositories/recipients.repository.interface'
import { Address } from '../../enterprise/entities/address.entity'
import { AddressesRepository } from '../repositories/addresses.repository.interface'
import { RecipientWithAddress } from '../../enterprise/value-objects/recipient-with-address.value-object'

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

type RegisterRecipientUseCaseReponse = Either<
  null,
  { recipient: RecipientWithAddress }
>

@Injectable()
export class RegisterRecipientUseCase {
  constructor(
    private readonly recipientsRepository: RecipientsRepository,
    private readonly addressesRepository: AddressesRepository,
  ) {}

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
    })

    await this.recipientsRepository.create(recipient)

    const address = Address.create({
      recipientId: recipient.id,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zipcode,
    })

    await this.addressesRepository.create(address)

    const recipientWithAddress = RecipientWithAddress.create({
      recipientId: recipient.id,
      name,
      addressId: address.id,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zipcode,
    })

    return right({ recipient: recipientWithAddress })
  }
}
