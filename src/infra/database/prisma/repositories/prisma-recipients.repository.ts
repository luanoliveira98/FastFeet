import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients.repository.interface'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient.entity'
import { PrismaRecipientMapper } from '../mappers/prisma-recipient.mapper'

@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: { id },
      include: { address: true },
    })

    if (!recipient) return null

    return PrismaRecipientMapper.toDomain(recipient)
  }

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrismaCreate(recipient)

    await this.prisma.recipient.create({
      data,
    })
  }

  async save(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrismaUpdate(recipient)

    await this.prisma.recipient.update({
      where: { id: recipient.id.toString() },
      data,
    })
  }

  async delete(recipient: Recipient): Promise<void> {
    await this.prisma.recipient.delete({
      where: { id: recipient.id.toString() },
    })
  }
}
