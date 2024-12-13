import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { PostOrderUseCase } from './post-order.use-case'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders.repository'
import { makeOrderFactory } from 'test/factories/make-order.factory'

describe('Post Order', () => {
  let sut: PostOrderUseCase
  let inMemoryOrdersRepository: InMemoryOrdersRepository

  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()

    sut = new PostOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to post an order', async () => {
    const order = makeOrderFactory()

    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      order: expect.objectContaining({
        status: 'WAITING',
        postedAt: expect.any(Date),
      }),
    })
  })

  it('should not be able to post an order when id does not exists', async () => {
    const result = await sut.execute({
      orderId: 'wrong-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
