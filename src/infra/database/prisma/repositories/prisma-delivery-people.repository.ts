import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { DeliveryPeopleRepository } from '@/domain/account/application/repositories/delivery-people.repository.interface'
import { DeliveryPerson } from '@/domain/account/enterprise/entities/delivery-person.entity'
import { PrismaDeliveryPersonMapper } from '../mappers/prisma-delivery-person.mapper'

@Injectable()
export class PrismaDevelieryPeopleRepository
  implements DeliveryPeopleRepository
{
  constructor(protected readonly prisma: PrismaService) {}

  async findByCpf(cpf: string): Promise<DeliveryPerson | null> {
    const deliveryPerson = await this.prisma.user.findUnique({
      where: { cpf, role: 'DELIVERY_PERSON' },
    })

    if (!deliveryPerson) return null

    return PrismaDeliveryPersonMapper.toDomain(deliveryPerson)
  }
}
