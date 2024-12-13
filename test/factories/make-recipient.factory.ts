import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.value-object'
import {
  Recipient,
  RecipientProps,
} from '@/domain/delivery/enterprise/entities/recipient.entity'
import { PrismaRecipientMapper } from '@/infra/database/prisma/mappers/prisma-recipient.mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeRecipientFactory(
  override: Partial<RecipientProps> = {},
  id?: UniqueEntityID,
) {
  const recipient = Recipient.create(
    {
      name: faker.person.fullName(),
      street: faker.location.street(),
      number: faker.number.int({ min: 1, max: 9999 }),
      complement: faker.lorem.word(),
      neighborhood: faker.location.county(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipcode: faker.location.zipCode(),
      ...override,
    },
    id,
  )

  return recipient
}

@Injectable()
export class RecipientFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaRecipient(
    data: Partial<RecipientProps> = {},
  ): Promise<Recipient> {
    const recipient = makeRecipientFactory(data)

    await this.prisma.recipient.create({
      data: PrismaRecipientMapper.toPrismaCreate(recipient),
    })

    return recipient
  }
}
