import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients.repository.interface'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient.entity'
import { RecipientWithAddress } from '@/domain/delivery/enterprise/value-objects/recipient-with-address.value-object'
import { InMemoryAddressesRepository } from './in-memory-addresses.repository'

export class InMemoryRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = []

  constructor(
    private readonly addressesRepository: InMemoryAddressesRepository,
  ) {}

  async findById(id: string): Promise<RecipientWithAddress | null> {
    const recipient = this.items.find((item) => item.id.toString() === id)

    if (!recipient) return null

    const address = await this.addressesRepository.findByRecipientId(id)

    if (!address) return null

    const recipientWithAddress = RecipientWithAddress.create({
      recipientId: recipient.id,
      name: recipient.name,
      addressId: address.id,
      street: address.street,
      number: address.number,
      complement: address.complement,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zipcode: address.zipcode,
    })

    return recipientWithAddress
  }

  async create(recipient: Recipient): Promise<void> {
    this.items.push(recipient)
  }

  async save(recipient: Recipient): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === recipient.id)

    this.items[itemIndex] = recipient
  }

  async delete(id: string): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.toString() === id)

    this.items.splice(itemIndex, 1)
  }
}
