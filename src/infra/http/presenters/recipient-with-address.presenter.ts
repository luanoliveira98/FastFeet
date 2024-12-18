import { RecipientWithAddress } from '@/domain/delivery/enterprise/value-objects/recipient-with-address.value-object'

export class RecipientWithAddressPresenter {
  static toHttp(recipient: RecipientWithAddress) {
    return {
      recipientId: recipient.recipientId.toString(),
      addressId: recipient.addressId.toString(),
      name: recipient.name,
      street: recipient.street,
      number: recipient.number,
      complement: recipient.complement,
      neighborhood: recipient.neighborhood,
      city: recipient.city,
      state: recipient.state,
      zipcode: recipient.zipcode,
    }
  }
}
