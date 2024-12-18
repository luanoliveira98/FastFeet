import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { EditRecipientUseCase } from './edit-recipient.use-case'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients.repository'
import { makeRecipientFactory } from 'test/factories/make-recipient.factory'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses.repository'
import { makeAddressFactory } from 'test/factories/make-address.factory'

describe('Edit Recipient', () => {
  let sut: EditRecipientUseCase
  let inMemoryRecipientsRepository: InMemoryRecipientsRepository
  let inMemoryAddressesRepository: InMemoryAddressesRepository

  beforeEach(() => {
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository(
      inMemoryAddressesRepository,
    )

    sut = new EditRecipientUseCase(
      inMemoryRecipientsRepository,
      inMemoryAddressesRepository,
    )
  })

  it('should be able to edit a recipient', async () => {
    const recipient = makeRecipientFactory()

    inMemoryRecipientsRepository.create(recipient)

    const address = makeAddressFactory({
      recipientId: recipient.id,
    })

    inMemoryAddressesRepository.create(address)

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      name: 'John Doe',
      street: 'Street',
      number: 1,
      complement: 'Complement',
      neighborhood: 'Neighborhood',
      city: 'City',
      state: 'State',
      zipcode: 'Zipcode',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      recipient: expect.objectContaining({
        name: 'John Doe',
        complement: 'Complement',
      }),
    })
  })

  it('should not be able to edit a recipient when id does not exists', async () => {
    const result = await sut.execute({
      recipientId: 'wrong-id',
      name: 'John Doe',
      street: 'Street',
      number: 1,
      complement: 'Complement',
      neighborhood: 'Neighborhood',
      city: 'City',
      state: 'State',
      zipcode: 'Zipcode',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
