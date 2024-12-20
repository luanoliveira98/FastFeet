import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders.repository'
import { makeOrderFactory } from 'test/factories/make-order.factory'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses.repository'
import { FetchNearbyOrdersUseCase } from './fetch-nearby-orders.use-case'
import { makeAddressFactory } from 'test/factories/make-address.factory'

describe('Fetch Nearby Orders', () => {
  let sut: FetchNearbyOrdersUseCase
  let inMemoryOrdersRepository: InMemoryOrdersRepository
  let inMemoryAddressesRepository: InMemoryAddressesRepository

  beforeEach(() => {
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryAddressesRepository,
    )

    sut = new FetchNearbyOrdersUseCase(inMemoryOrdersRepository)
  })

  it('should be able to fetch nearby orders', async () => {
    const firstOrder = makeOrderFactory({ status: 'WAITING' })
    const secondOrder = makeOrderFactory({ status: 'WAITING' })
    const thirdOrder = makeOrderFactory({ status: 'WAITING' })
    const fourthOrder = makeOrderFactory({ status: 'STORED' })

    inMemoryOrdersRepository.items.push(firstOrder, secondOrder, thirdOrder)

    inMemoryAddressesRepository.items.push(
      makeAddressFactory({
        recipientId: firstOrder.recipientId,
        latitude: -31.7622969,
        longitude: -52.3294118,
      }),
      makeAddressFactory({
        recipientId: secondOrder.recipientId,
        latitude: -31.7622969,
        longitude: -52.3294118,
      }),
      makeAddressFactory({
        recipientId: thirdOrder.recipientId,
        latitude: -70.7669218,
        longitude: -72.4532112,
      }),
      makeAddressFactory({
        recipientId: fourthOrder.recipientId,
        latitude: -31.7622969,
        longitude: -52.3294118,
      }),
    )

    const result = await sut.execute({
      deliveryPersonLatitude: -31.7673115,
      deliveryPersonLongitude: -52.3462634,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value.orders).toHaveLength(2)
    expect(result.value.orders).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: firstOrder.id,
        }),
        expect.objectContaining({
          id: secondOrder.id,
        }),
      ]),
    )
  })
})
