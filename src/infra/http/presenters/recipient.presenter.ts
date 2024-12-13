import { Recipient } from '@/domain/delivery/enterprise/entities/recipient.entity'

export class RecipientPresenter {
  static toHttp(recipient: Recipient) {
    return {
      recipientId: recipient.id.toString(),
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
