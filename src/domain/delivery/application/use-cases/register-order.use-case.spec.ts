import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders.repository'
import { RegisterOrderUseCase } from './register-order.use-case'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses.repository'

describe('Register Order', () => {
  let sut: RegisterOrderUseCase
  let inMemoryOrdersRepository: InMemoryOrdersRepository
  let inMemoryAddressesRepository: InMemoryAddressesRepository

  beforeEach(() => {
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryAddressesRepository,
    )

    sut = new RegisterOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to register an order', async () => {
    const result = await sut.execute({
      recipientId: 'recipient-01',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      order: inMemoryOrdersRepository.items[0],
    })
  })
})
