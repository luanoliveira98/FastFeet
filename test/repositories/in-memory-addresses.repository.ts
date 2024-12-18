import { AddressesRepository } from '@/domain/delivery/application/repositories/addresses.repository.interface'
import { Address } from '@/domain/delivery/enterprise/entities/address.entity'

export class InMemoryAddressesRepository implements AddressesRepository {
  public items: Address[] = []

  async findByRecipientId(recipientId: string): Promise<Address | null> {
    const address = this.items.find(
      (item) => item.recipientId.toString() === recipientId,
    )

    if (!address) return null

    return address
  }

  async create(address: Address): Promise<void> {
    this.items.push(address)
  }

  async save(address: Address): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === address.id)

    this.items[itemIndex] = address
  }

  async delete(address: Address): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === address.id)

    this.items.splice(itemIndex, 1)
  }
}
