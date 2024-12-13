import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.value-object'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient.entity'
import { Prisma } from '@prisma/client'

export class PrismaRecipientMapper {
  static toDomain(
    raw: Prisma.RecipientGetPayload<{ include: { address: true } }>,
  ) {
    return Recipient.create(
      {
        name: raw.name,
        street: raw.address.street,
        number: raw.address.number,
        complement: raw.address.complement,
        neighborhood: raw.address.neighborhood,
        city: raw.address.city,
        state: raw.address.state,
        zipcode: raw.address.zipcode,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaCreate(
    recipient: Recipient,
  ): Prisma.RecipientUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      address: {
        create: {
          street: recipient.street,
          number: recipient.number,
          complement: recipient.complement,
          neighborhood: recipient.neighborhood,
          city: recipient.city,
          state: recipient.state,
          zipcode: recipient.zipcode,
        },
      },
    }
  }

  static toPrismaUpdate(
    recipient: Recipient,
  ): Prisma.RecipientUncheckedUpdateInput {
    return {
      name: recipient.name,
      address: {
        update: {
          street: recipient.street,
          number: recipient.number,
          complement: recipient.complement,
          neighborhood: recipient.neighborhood,
          city: recipient.city,
          state: recipient.state,
          zipcode: recipient.zipcode,
        },
      },
    }
  }
}
