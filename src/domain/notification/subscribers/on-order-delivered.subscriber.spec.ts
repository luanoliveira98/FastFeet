import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders.repository'
import { SendNotificationUseCase } from '../use-cases/send-notification.use-case'
import { MockInstance } from 'vitest'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses.repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications.repository'
import { makeOrderFactory } from 'test/factories/make-order.factory'
import { waitFor } from 'test/utils/wait-for.util'
import { OnOrderDeliveredSubscriber } from './on-order-delivered.subscriber'

describe('On Order Delivered Subscriber', () => {
  let inMemoryAddressesRepository: InMemoryAddressesRepository
  let inMemoryOrdersRepository: InMemoryOrdersRepository
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository
  let sendNotificationUseCase: SendNotificationUseCase
  let sendNotificationExecuteSpy: MockInstance

  beforeEach(() => {
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryAddressesRepository,
    )

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnOrderDeliveredSubscriber(
      inMemoryOrdersRepository,
      sendNotificationUseCase,
    )
  })

  it('should be able to send a notification when an order is delivered', async () => {
    const order = makeOrderFactory()
    inMemoryOrdersRepository.create(order)

    order.delivered()
    inMemoryOrdersRepository.save(order)

    await waitFor(() => expect(sendNotificationExecuteSpy).toHaveBeenCalled())

    expect(inMemoryNotificationsRepository.items[0]).toEqual(
      expect.objectContaining({
        recipientId: order.recipientId,
        title: `Order ${order.id.toString()} delivered`,
      }),
    )
  })
})
