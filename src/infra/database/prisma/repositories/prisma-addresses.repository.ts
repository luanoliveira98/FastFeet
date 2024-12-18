import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Address } from '@/domain/delivery/enterprise/entities/address.entity'
import { PrismaAddressMapper } from '../mappers/prisma-address.mapper'
import { AddressesRepository } from '@/domain/delivery/application/repositories/addresses.repository.interface'

@Injectable()
export class PrismaAddressesRepository implements AddressesRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async findByRecipientId(recipientId: string): Promise<Address | null> {
    const address = await this.prisma.address.findUnique({
      where: { recipientId },
    })

    if (!address) return null

    return PrismaAddressMapper.toDomain(address)
  }

  async create(address: Address): Promise<void> {
    const data = PrismaAddressMapper.toPrisma(address)

    await this.prisma.address.create({
      data,
    })
  }

  async save(address: Address): Promise<void> {
    const data = PrismaAddressMapper.toPrisma(address)

    await this.prisma.address.update({
      where: { id: address.id.toString() },
      data,
    })
  }

  async delete(address: Address): Promise<void> {
    await this.prisma.address.delete({
      where: { id: address.id.toString() },
    })
  }
}
