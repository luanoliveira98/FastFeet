import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import {
  DeliveryPerson,
  DeliveryPersonProps,
} from '@/domain/account/enterprise/entities/delivery-person.entity'
import { PrismaDeliveryPersonMapper } from '@/infra/database/prisma/mappers/prisma-delivery-person.mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeDeliveryPersonFactory(
  override: Partial<DeliveryPersonProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryPerson = DeliveryPerson.create(
    {
      name: faker.person.fullName(),
      cpf: faker.phone.number(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return deliveryPerson
}

@Injectable()
export class DeliveryPersonFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaDeliveryPerson(
    data: Partial<DeliveryPersonProps> = {},
  ): Promise<DeliveryPerson> {
    const deliveryPerson = makeDeliveryPersonFactory(data)

    await this.prisma.user.create({
      data: PrismaDeliveryPersonMapper.toPrisma(deliveryPerson),
    })

    return deliveryPerson
  }
}
