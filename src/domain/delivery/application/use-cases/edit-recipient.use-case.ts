import { Either, left, right } from '@/core/helpers/either.helper'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { RecipientsRepository } from '../repositories/recipients.repository.interface'
import { Recipient } from '../../enterprise/entities/recipient.entity'
import { Address } from '../../enterprise/entities/address.entity'
import { AddressesRepository } from '../repositories/addresses.repository.interface'
import { RecipientWithAddress } from '../../enterprise/value-objects/recipient-with-address.value-object'
import { GeoLocation } from '../location/geo-location.interface'

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
  { recipient: RecipientWithAddress }
>

@Injectable()
export class EditRecipientUseCase {
  constructor(
    private readonly recipientsRepository: RecipientsRepository,
    private readonly addressesRepository: AddressesRepository,
    private readonly geoLocation: GeoLocation,
  ) {}

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
    const recipientWithAddress =
      await this.recipientsRepository.findById(recipientId)

    if (!recipientWithAddress) return left(new ResourceNotFoundError())

    const recipient = Recipient.create(
      {
        name,
      },
      recipientWithAddress.recipientId,
    )

    await this.recipientsRepository.save(recipient)

    const { latitude, longitude } = await this.geoLocation.generate({
      street,
      number,
      city,
      state,
    })

    const address = Address.create(
      {
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        zipcode,
        recipientId: recipientWithAddress.recipientId,
        latitude,
        longitude,
      },
      recipientWithAddress.addressId,
    )

    await this.addressesRepository.save(address)

    const recipientWithAddressEdited = RecipientWithAddress.create({
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
      latitude,
      longitude,
    })

    return right({ recipient: recipientWithAddressEdited })
  }
}
