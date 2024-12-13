import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders.repository'
import { RegisterOrderUseCase } from './register-order.use-case'

describe('Register Order', () => {
  let sut: RegisterOrderUseCase
  let inMemoryOrdersRepository: InMemoryOrdersRepository

  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()

    sut = new RegisterOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to register a order', async () => {
    const result = await sut.execute({
      recipientId: 'recipient-01',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      order: inMemoryOrdersRepository.items[0],
    })
  })
})
