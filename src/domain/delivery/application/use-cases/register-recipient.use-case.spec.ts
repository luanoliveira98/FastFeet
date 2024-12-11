import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients.repository'
import { RegisterRecipientUseCase } from './register-recipient.use-case'

describe('Register Recipient', () => {
  let sut: RegisterRecipientUseCase
  let inMemoryRecipientsRepository: InMemoryRecipientsRepository

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()

    sut = new RegisterRecipientUseCase(inMemoryRecipientsRepository)
  })

  it('should be able to register a recipient', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      street: 'Avenue 01',
      number: 20,
      neighborhood: 'Center',
      city: 'City',
      state: 'ST',
      zipcode: '12345678',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      recipient: inMemoryRecipientsRepository.items[0],
    })
  })
})
