import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { EditOrderUseCase } from './edit-order.use-case'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders.repository'
import { makeOrderFactory } from 'test/factories/make-order.factory'
import { InMemoryDeliveryPeopleRepository } from 'test/repositories/in-memory-delivery-people.repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients.repository'
import { makeRecipientFactory } from 'test/factories/make-recipient.factory'
import { makeDeliveryPersonFactory } from 'test/factories/make-delivery-person.factory'
import { InvalidRecipientError } from './errors/invalid-recipient.error'
import { InvalidDeliveryPersonError } from './errors/invalid-delivery-person.error'
import dayjs from 'dayjs'
import { InvalidDatesError } from './errors/invalid-dates.error'

describe('Edit Order', () => {
  let sut: EditOrderUseCase
  let inMemoryOrdersRepository: InMemoryOrdersRepository
  let inMemoryDeliveryPeopleRepository: InMemoryDeliveryPeopleRepository
  let inMemoryRecipientsRepository: InMemoryRecipientsRepository

  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryDeliveryPeopleRepository = new InMemoryDeliveryPeopleRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()

    sut = new EditOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryDeliveryPeopleRepository,
      inMemoryRecipientsRepository,
    )
  })

  it('should be able to edit an order', async () => {
    const order = makeOrderFactory()

    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      recipientId: order.recipientId.toString(),
      status: 'WAITING',
      storedAt: order.storedAt,
      postedAt: new Date(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      order: expect.objectContaining({
        status: 'WAITING',
        postedAt: expect.any(Date),
      }),
    })
  })

  it('should be able to edit an order when it changes recipient id and delivery person id', async () => {
    const recipient = makeRecipientFactory()

    inMemoryRecipientsRepository.create(recipient)

    const deliveryPerson = makeDeliveryPersonFactory()

    inMemoryDeliveryPeopleRepository.create(deliveryPerson)

    const order = makeOrderFactory()

    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      recipientId: recipient.id.toString(),
      deliveryPersonId: deliveryPerson.id.toString(),
      status: order.status,
      storedAt: order.storedAt,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      order: expect.objectContaining({
        recipientId: recipient.id,
        deliveryPersonId: deliveryPerson.id,
      }),
    })
  })

  it('should not be able to edit an order when id does not exists', async () => {
    const order = makeOrderFactory()

    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: 'wrong-id',
      recipientId: order.recipientId.toString(),
      status: order.status,
      storedAt: order.storedAt,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit an order when recipient is invalid', async () => {
    const order = makeOrderFactory()

    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      recipientId: 'invalid-recipient-id',
      status: order.status,
      storedAt: order.storedAt,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidRecipientError)
  })

  it('should not be able to edit an order when delivery person is invalid', async () => {
    const order = makeOrderFactory()

    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      recipientId: order.recipientId.toString(),
      deliveryPersonId: 'invalid-delivery-person-id',
      status: order.status,
      storedAt: order.storedAt,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidDeliveryPersonError)
  })

  it('should not be able to edit an order when post date is invalid', async () => {
    const order = makeOrderFactory()

    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      recipientId: order.recipientId.toString(),
      status: order.status,
      storedAt: order.storedAt,
      postedAt: dayjs(order.storedAt).subtract(1, 'hour').toDate(),
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidDatesError)
  })

  it('should not be able to edit an order when pick up date is invalid', async () => {
    const order = makeOrderFactory()

    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      recipientId: order.recipientId.toString(),
      status: order.status,
      storedAt: order.storedAt,
      postedAt: dayjs(order.storedAt).add(1, 'hour').toDate(),
      pickedUpAt: dayjs(order.storedAt).subtract(1, 'hour').toDate(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidDatesError)
  })

  it('should not be able to edit an order when delivery date is invalid', async () => {
    const order = makeOrderFactory()

    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      recipientId: order.recipientId.toString(),
      status: order.status,
      storedAt: order.storedAt,
      postedAt: dayjs(order.storedAt).add(1, 'hour').toDate(),
      pickedUpAt: dayjs(order.storedAt).add(2, 'hour').toDate(),
      deliveredAt: dayjs(order.storedAt).subtract(1, 'hour').toDate(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidDatesError)
  })
})
