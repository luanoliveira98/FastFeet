import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.value-object'
import { Address } from '@/domain/delivery/enterprise/entities/address.entity'
import { Prisma, Address as PrismaAddress } from '@prisma/client'

export class PrismaAddressMapper {
  static toDomain(raw: PrismaAddress) {
    return Address.create(
      {
        recipientId: raw.recipientId
          ? new UniqueEntityID(raw.recipientId)
          : null,
        deliveryPersonId: raw.deliveryPersonId
          ? new UniqueEntityID(raw.deliveryPersonId)
          : null,
        street: raw.street,
        number: raw.number,
        complement: raw.complement,
        neighborhood: raw.neighborhood,
        city: raw.city,
        state: raw.state,
        zipcode: raw.zipcode,
        latitude: raw.latitude.toNumber(),
        longitude: raw.longitude.toNumber(),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(address: Address): Prisma.AddressUncheckedCreateInput {
    return {
      id: address.id.toString(),
      recipientId: address.recipientId?.toString(),
      deliveryPersonId: address.deliveryPersonId?.toString(),
      street: address.street,
      number: address.number,
      complement: address.complement,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zipcode: address.zipcode,
      latitude: address.latitude,
      longitude: address.longitude,
    }
  }
}
