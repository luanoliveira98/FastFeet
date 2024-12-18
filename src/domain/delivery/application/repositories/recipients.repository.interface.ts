import { Recipient } from '../../enterprise/entities/recipient.entity'
import { RecipientWithAddress } from '../../enterprise/value-objects/recipient-with-address.value-object'

export abstract class RecipientsRepository {
  abstract findById(id: string): Promise<RecipientWithAddress | null>
  abstract create(recipient: Recipient): Promise<void>
  abstract save(recipient: Recipient): Promise<void>
  abstract delete(recipient: Recipient): Promise<void>
}
