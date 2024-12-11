import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients.repository.interface'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient.entity'

export class InMemoryRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = []

  async findById(id: string): Promise<Recipient | null> {
    const Recipient = this.items.find((item) => item.id.toString() === id)

    if (!Recipient) return null

    return Recipient
  }

  async create(Recipient: Recipient): Promise<void> {
    this.items.push(Recipient)
  }

  async save(Recipient: Recipient): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === Recipient.id)

    this.items[itemIndex] = Recipient
  }

  async delete(Recipient: Recipient): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === Recipient.id)

    this.items.splice(itemIndex, 1)
  }
}
