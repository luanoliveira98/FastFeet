import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients.repository'
import { RegisterRecipientUseCase } from './register-recipient.use-case'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses.repository'
import { GeoLocationFake } from 'test/location/geo-location.fake'

describe('Register Recipient', () => {
  let sut: RegisterRecipientUseCase
  let inMemoryRecipientsRepository: InMemoryRecipientsRepository
  let inMemoryAddressesRepository: InMemoryAddressesRepository
  let geoLocationFake: GeoLocationFake

  beforeEach(() => {
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository(
      inMemoryAddressesRepository,
    )
    geoLocationFake = new GeoLocationFake()

    sut = new RegisterRecipientUseCase(
      inMemoryRecipientsRepository,
      inMemoryAddressesRepository,
      geoLocationFake,
    )
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
      recipient: expect.objectContaining({
        recipientId: inMemoryRecipientsRepository.items[0].id,
        addressId: inMemoryAddressesRepository.items[0].id,
      }),
    })
  })
})
