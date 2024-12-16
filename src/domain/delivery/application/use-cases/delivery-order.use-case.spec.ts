import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders.repository'
import { makeOrderFactory } from 'test/factories/make-order.factory'
import { InMemoryOrderConfirmationPhotosRepository } from 'test/repositories/in-memory-order-confirmation-photos.repository'
import { DeliveryOrderUseCase } from './delivery-order.use-case'
import { makeOrderConfirmationPhotoFactory } from 'test/factories/make-order-confirmation-photo.factory'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.value-object'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { InvalidOrderConfirmationPhotoError } from './errors/invalid-order-confirmation-photo.error'
import { InvalidOrderError } from './errors/invalid-order.error'
import { NotAllowedError } from '@/domain/account/application/use-cases/errors/not-allowed.error'

describe('Delivery Order', () => {
  let sut: DeliveryOrderUseCase
  let inMemoryOrdersRepository: InMemoryOrdersRepository
  let inMemoryOrderConfirmationPhotosRepository: InMemoryOrderConfirmationPhotosRepository

  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryOrderConfirmationPhotosRepository = new InMemoryOrderConfirmationPhotosRepository()

    sut = new DeliveryOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryOrderConfirmationPhotosRepository,
    )
  })

  it('should be able to delivery an order', async () => {
    const order = makeOrderFactory({
      status: 'PICKED_UP',
      pickedUpAt: new Date(),
      deliveryPersonId: new UniqueEntityID('delivery-person-id')
    })

    inMemoryOrdersRepository.create(order)

    const orderConfirmationPhoto = makeOrderConfirmationPhotoFactory()

    inMemoryOrderConfirmationPhotosRepository.create(orderConfirmationPhoto)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliveryPersonId: order.deliveryPersonId.toString(),
      confirmationPhotoId: orderConfirmationPhoto.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      order: expect.objectContaining({
        status: 'DELIVERED',
        deliveredAt: expect.any(Date),
      }),
    })
    expect(inMemoryOrderConfirmationPhotosRepository.items[0]).toEqual(
      expect.objectContaining({
        orderId: order.id
      })
    )
  })

  it('should not be able to delivery an order when id does not exists', async () => {
    const order = makeOrderFactory({
      status: 'PICKED_UP',
      pickedUpAt: new Date(),
      deliveryPersonId: new UniqueEntityID('delivery-person-id')
    })

    inMemoryOrdersRepository.create(order)

    const orderConfirmationPhoto = makeOrderConfirmationPhotoFactory()

    inMemoryOrderConfirmationPhotosRepository.create(orderConfirmationPhoto)

    const result = await sut.execute({
      orderId: 'wrong-id',
      deliveryPersonId: order.deliveryPersonId.toString(),
      confirmationPhotoId: orderConfirmationPhoto.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to delivery an order when order confirmation photo id does not exists', async () => {
    const order = makeOrderFactory({
      status: 'PICKED_UP',
      pickedUpAt: new Date(),
      deliveryPersonId: new UniqueEntityID('delivery-person-id')
    })

    inMemoryOrdersRepository.create(order)

    const orderConfirmationPhoto = makeOrderConfirmationPhotoFactory()

    inMemoryOrderConfirmationPhotosRepository.create(orderConfirmationPhoto)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliveryPersonId: order.deliveryPersonId.toString(),
      confirmationPhotoId: 'wrong-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidOrderConfirmationPhotoError)
  })

  it('should not be able to delivery an order when order (status) is invalid', async () => {
    const order = makeOrderFactory({
      status: 'WAITING',
      pickedUpAt: new Date(),
      deliveryPersonId: new UniqueEntityID('delivery-person-id')
    })

    inMemoryOrdersRepository.create(order)

    const orderConfirmationPhoto = makeOrderConfirmationPhotoFactory()

    inMemoryOrderConfirmationPhotosRepository.create(orderConfirmationPhoto)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliveryPersonId: order.deliveryPersonId.toString(),
      confirmationPhotoId: orderConfirmationPhoto.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidOrderError)
  })

  it('should not be able to delivery an order when order (picked-up date) is invalid', async () => {
    const order = makeOrderFactory({
      status: 'PICKED_UP',
      pickedUpAt: null,
      deliveryPersonId: new UniqueEntityID('delivery-person-id')
    })

    inMemoryOrdersRepository.create(order)

    const orderConfirmationPhoto = makeOrderConfirmationPhotoFactory()

    inMemoryOrderConfirmationPhotosRepository.create(orderConfirmationPhoto)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliveryPersonId: order.deliveryPersonId.toString(),
      confirmationPhotoId: orderConfirmationPhoto.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidOrderError)
  })

  it('should not be able to delivery an order when delivery person is not allowed', async () => {
    const order = makeOrderFactory({
      status: 'PICKED_UP',
      pickedUpAt: new Date(),
      deliveryPersonId: new UniqueEntityID('delivery-person-id')
    })

    inMemoryOrdersRepository.create(order)

    const orderConfirmationPhoto = makeOrderConfirmationPhotoFactory()

    inMemoryOrderConfirmationPhotosRepository.create(orderConfirmationPhoto)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliveryPersonId: 'another-delivery-person-id',
      confirmationPhotoId: orderConfirmationPhoto.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
