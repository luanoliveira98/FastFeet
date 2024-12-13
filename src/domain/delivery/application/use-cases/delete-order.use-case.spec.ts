import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders.repository'
import { makeOrderFactory } from 'test/factories/make-order.factory'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { DeleteOrderUseCase } from './delete-order.use-case'

describe('Delete Order', () => {
  let sut: DeleteOrderUseCase
  let inMemoryOrdersRepository: InMemoryOrdersRepository

  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()

    sut = new DeleteOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to delete an order', async () => {
    const order = makeOrderFactory()

    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      id: order.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items).toHaveLength(0)
  })

  it('should not be able to delete an order when id does not exists', async () => {
    const order = makeOrderFactory()

    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      id: 'wrong-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
