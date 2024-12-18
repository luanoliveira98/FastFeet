import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.value-object'
import { RecipientWithAddress } from '@/domain/delivery/enterprise/value-objects/recipient-with-address.value-object'
import { Prisma } from '@prisma/client'

export class PrismaRecipientWithAddressMapper {
  static toDomain(
    raw: Prisma.RecipientGetPayload<{ include: { address: true } }>,
  ) {
    return RecipientWithAddress.create({
      recipientId: new UniqueEntityID(raw.id),
      name: raw.name,
      addressId: new UniqueEntityID(raw.address.id),
      street: raw.address.street,
      number: raw.address.number,
      complement: raw.address.complement,
      neighborhood: raw.address.neighborhood,
      city: raw.address.city,
      state: raw.address.state,
      zipcode: raw.address.zipcode,
    })
  }
}
