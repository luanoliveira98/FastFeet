import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders.repository'
import { makeOrderFactory } from 'test/factories/make-order.factory'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses.repository'
import { InMemoryDeliveryPeopleRepository } from 'test/repositories/in-memory-delivery-people.repository'
import { FetchDeliveryPersonDeliveriesUseCase } from './fetch-delivery-person-deliveries.use-case'
import { makeDeliveryPersonFactory } from 'test/factories/make-delivery-person.factory'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.value-object'

describe('Fetch Delivery Person Deliveries', () => {
  let sut: FetchDeliveryPersonDeliveriesUseCase
  let inMemoryOrdersRepository: InMemoryOrdersRepository
  let inMemoryAddressesRepository: InMemoryAddressesRepository
  let inMemoryDeliveryPeopleRepository: InMemoryDeliveryPeopleRepository

  beforeEach(() => {
    inMemoryDeliveryPeopleRepository = new InMemoryDeliveryPeopleRepository()
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryAddressesRepository,
    )

    sut = new FetchDeliveryPersonDeliveriesUseCase(
      inMemoryDeliveryPeopleRepository,
      inMemoryOrdersRepository,
    )
  })

  it('should be able to fetch deliveries', async () => {
    const deliveryPerson = makeDeliveryPersonFactory()

    inMemoryDeliveryPeopleRepository.create(deliveryPerson)

    inMemoryOrdersRepository.items.push(
      makeOrderFactory({
        deliveryPersonId: deliveryPerson.id,
        status: 'DELIVERED',
      }),
      makeOrderFactory({
        deliveryPersonId: deliveryPerson.id,
        status: 'DELIVERED',
      }),
      makeOrderFactory({
        deliveryPersonId: deliveryPerson.id,
        status: 'PICKED_UP',
      }),
      makeOrderFactory({
        deliveryPersonId: new UniqueEntityID('another-delivery-person'),
        status: 'DELIVERED',
      }),
    )

    const result = await sut.execute({
      deliveryPersonId: deliveryPerson.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) expect(result.value.deliveries).toHaveLength(2)
  })

  it('should not be able to fetch deliveries when id does not exists', async () => {
    const result = await sut.execute({
      deliveryPersonId: 'wrong-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
