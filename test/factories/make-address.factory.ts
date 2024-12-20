import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.value-object'
import {
  Address,
  AddressProps,
} from '@/domain/delivery/enterprise/entities/address.entity'
import { PrismaAddressMapper } from '@/infra/database/prisma/mappers/prisma-address.mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeAddressFactory(
  override: Partial<AddressProps> = {},
  id?: UniqueEntityID,
) {
  const address = Address.create(
    {
      street: faker.location.street(),
      number: faker.number.int({ min: 1, max: 9999 }),
      complement: faker.lorem.word(),
      neighborhood: faker.location.county(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipcode: faker.location.zipCode(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      ...override,
    },
    id,
  )

  return address
}

@Injectable()
export class AddressFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaAddress(data: Partial<AddressProps> = {}): Promise<Address> {
    const address = makeAddressFactory(data)

    await this.prisma.address.create({
      data: PrismaAddressMapper.toPrisma(address),
    })

    return address
  }
}
