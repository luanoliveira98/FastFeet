import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients.repository'
import { makeRecipientFactory } from 'test/factories/make-recipient.factory'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { DeleteRecipientUseCase } from './delete-recipient.use-case'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses.repository'
import { makeAddressFactory } from 'test/factories/make-address.factory'

describe('Delete Recipient', () => {
  let sut: DeleteRecipientUseCase
  let inMemoryRecipientsRepository: InMemoryRecipientsRepository
  let inMemoryAddressesRepository: InMemoryAddressesRepository

  beforeEach(() => {
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository(
      inMemoryAddressesRepository,
    )

    sut = new DeleteRecipientUseCase(inMemoryRecipientsRepository)
  })

  it('should be able to delete a recipient', async () => {
    const recipient = makeRecipientFactory()

    inMemoryRecipientsRepository.create(recipient)

    const address = makeAddressFactory({
      recipientId: recipient.id,
    })

    inMemoryAddressesRepository.create(address)

    const result = await sut.execute({
      id: recipient.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a recipient when id does not exists', async () => {
    const recipient = makeRecipientFactory()

    inMemoryRecipientsRepository.create(recipient)

    const result = await sut.execute({
      id: 'wrong-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
