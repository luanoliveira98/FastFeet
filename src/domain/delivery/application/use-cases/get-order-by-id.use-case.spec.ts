import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders.repository'
import { makeOrderFactory } from 'test/factories/make-order.factory'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { GetOrderByIdUseCase } from './get-order-by-id.use-case'

describe('Get Order By Id', () => {
  let sut: GetOrderByIdUseCase
  let inMemoryOrdersRepository: InMemoryOrdersRepository

  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()

    sut = new GetOrderByIdUseCase(inMemoryOrdersRepository)
  })

  it('should be able to get an order', async () => {
    const order = makeOrderFactory()

    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      id: order.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      order,
    })
  })

  it('should not be able to get an order when id does not exists', async () => {
    const result = await sut.execute({
      id: 'wrong-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
