import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { PickUpOrderUseCase } from './pick-up-order.use-case'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders.repository'
import { makeOrderFactory } from 'test/factories/make-order.factory'
import { InMemoryDeliveryPeopleRepository } from 'test/repositories/in-memory-delivery-people.repository'
import { makeDeliveryPersonFactory } from 'test/factories/make-delivery-person.factory'
import { InvalidDeliveryPersonError } from './errors/invalid-delivery-person.error'
import { InvalidOrderError } from './errors/invalid-order.error'

describe('PickUp Order', () => {
  let sut: PickUpOrderUseCase
  let inMemoryOrdersRepository: InMemoryOrdersRepository
  let inMemoryDeliveryPeopleRepository: InMemoryDeliveryPeopleRepository

  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryDeliveryPeopleRepository = new InMemoryDeliveryPeopleRepository()

    sut = new PickUpOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryDeliveryPeopleRepository,
    )
  })

  it('should be able to pick-up an order', async () => {
    const order = makeOrderFactory({
      status: 'WAITING',
      postedAt: new Date(),
    })

    inMemoryOrdersRepository.create(order)

    const deliveryPerson = makeDeliveryPersonFactory()

    inMemoryDeliveryPeopleRepository.create(deliveryPerson)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliveryPersonId: deliveryPerson.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      order: expect.objectContaining({
        deliveryPersonId: deliveryPerson.id,
        status: 'PICKED UP',
        pickedUpAt: expect.any(Date),
      }),
    })
  })

  it('should not be able to pick-up an order when order id does not exists', async () => {
    const deliveryPerson = makeDeliveryPersonFactory()

    inMemoryDeliveryPeopleRepository.create(deliveryPerson)

    const result = await sut.execute({
      orderId: 'wrong-id',
      deliveryPersonId: deliveryPerson.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to pick-up an order when delivery person is invalid', async () => {
    const order = makeOrderFactory({
      status: 'WAITING',
      postedAt: new Date(),
    })

    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliveryPersonId: 'invalid-delivery-person',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidDeliveryPersonError)
  })

  it('should not be able to pick-up an order when order is not posted (STORED) yet', async () => {
    const order = makeOrderFactory({
      status: 'STORED',
      postedAt: new Date(),
    })

    inMemoryOrdersRepository.create(order)

    const deliveryPerson = makeDeliveryPersonFactory()

    inMemoryDeliveryPeopleRepository.create(deliveryPerson)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliveryPersonId: deliveryPerson.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidOrderError)
  })

  it('should not be able to pick-up an order when order is not posted (POSTED AT) yet', async () => {
    const order = makeOrderFactory({
      status: 'STORED',
      postedAt: null,
    })

    inMemoryOrdersRepository.create(order)

    const deliveryPerson = makeDeliveryPersonFactory()

    inMemoryDeliveryPeopleRepository.create(deliveryPerson)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliveryPersonId: deliveryPerson.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidOrderError)
  })
})
