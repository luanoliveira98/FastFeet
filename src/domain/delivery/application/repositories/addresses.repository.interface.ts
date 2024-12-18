import { Address } from '../../enterprise/entities/address.entity'

export abstract class AddressesRepository {
  abstract findByRecipientId(addressId: string): Promise<Address | null>
  abstract create(address: Address): Promise<void>
  abstract save(address: Address): Promise<void>
  abstract delete(address: Address): Promise<void>
}
