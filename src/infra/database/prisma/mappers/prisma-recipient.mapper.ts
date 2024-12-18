import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.value-object'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient.entity'
import { Prisma, Recipient as PrismaRecipient } from '@prisma/client'

export class PrismaRecipientMapper {
  static toDomain(raw: PrismaRecipient) {
    return Recipient.create(
      {
        name: raw.name,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
    }
  }
}
