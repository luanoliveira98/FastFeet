import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { DeliveryPerson } from '@/domain/account/enterprise/entities/delivery-person.entity'
import { User as PrismaUser, Prisma } from '@prisma/client'

export class PrismaDeliveryPersonMapper {
  static toDomain(raw: PrismaUser) {
    return DeliveryPerson.create(
      {
        name: raw.name,
        cpf: raw.cpf,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    deliveryPerson: DeliveryPerson,
  ): Prisma.UserUncheckedCreateInput {
    return {
      id: deliveryPerson.id.toString(),
      name: deliveryPerson.name,
      cpf: deliveryPerson.cpf,
      password: deliveryPerson.password,
      role: 'DELIVERY_PERSON',
    }
  }
}
