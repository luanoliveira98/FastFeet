import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients.repository.interface'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient.entity'
import { PrismaRecipientMapper } from '../mappers/prisma-recipient.mapper'
import { PrismaRecipientWithAddressMapper } from '../mappers/prisma-recipient-with-address.mapper'
import { RecipientWithAddress } from '@/domain/delivery/enterprise/value-objects/recipient-with-address.value-object'

@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async findById(id: string): Promise<RecipientWithAddress | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: { id },
      include: { address: true },
    })

    if (!recipient?.address) return null

    return PrismaRecipientWithAddressMapper.toDomain(recipient)
  }

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.recipient.create({
      data,
    })
  }

  async save(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.recipient.update({
      where: { id: recipient.id.toString() },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.recipient.delete({
      where: { id },
    })
  }
}
